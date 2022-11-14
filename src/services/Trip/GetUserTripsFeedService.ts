
import Itinerary from '../../models/Itinerary';
import FindUserService from '../User/FindUserService';
import { TripStatus } from '../../enums/TripStatus';
// import GetItineraryTodaysTripStatusService from './GetItineraryTodaysTripStatusService';
import DateUtils from '../Utils/Date';
import AppError from '../../errors/AppError';
import FindItinerariesByDriverUserIdService from '../Itinerary/FindItinerariesByDriverUserIdService';
import FindItinerariesByPassengerUserIdService from '../Itinerary/FindItinerariesByPassengerUserIdService';
import { TripType } from '../../enums/TripType';
import { TripDay } from '../../enums/TripDay';
import Utils from '../Utils/Utils';
import { TripUserType } from '../../constants/TripUserType';
import ItineraryHasPassengersWithContractTypeByItineraryIdService from '../Itinerary/ItineraryHasPassengersWithContractTypeByItineraryIdService';
import { ItineraryContract } from '../../enums/ItineraryContract';
import { getRepository } from 'typeorm';
import Trip from '../../models/Trip';
import User from '../../models/User';
import CheckTodaysReturnTripIsAvailable from './CheckTodaysReturnTripIsAvailable';

interface GetFeedForDriverProps {
  itinerary: Itinerary
}

interface GetFeedForPassengerProps {
  itinerary: Itinerary,
  user: User
}

interface Request {
  id_user: string,
  tripDay: string,
  tripType: string,
  userType: string,
}

interface TripInfo {
  status: TripStatus;
  id?: number; // é opcional porque a viagem pode ainda não ter sido criada
}

interface Return {
  itinerary: Itinerary;
  // itineraryInfoDriver?: 'recurring' | 'specific_day' | 'both' | undefined;
  // itineraryInfoPassenger?: 'avulse' | 'recurring' | undefined;
  itineraryInfoDriver?: string,
  itineraryInfoPassenger?: string,

  tripGoing: TripInfo,
  tripReturn?: TripInfo
}

class GetUserTripsFeedService {
  private checkItineraryHasRecurringTrips(itinerary: Itinerary): boolean {
    if (!itinerary.days_of_week || itinerary.days_of_week === '0000000') {
      return false
    }

    return true
  }

  // se feed for para driver
  private async getItineraryInfoTypeByItineraryPassengers(itinerary: Itinerary): Promise<string> {
    const itineraryHasPassengersWithContractTypeByItineraryIdService = new ItineraryHasPassengersWithContractTypeByItineraryIdService()

    const itineraryHasRecurringPassengers = await itineraryHasPassengersWithContractTypeByItineraryIdService.execute({ id_itinerary: "" + itinerary.id_itinerary, contract_type: ItineraryContract.recurring })
    const itineraryHasAvulsePassengers = await itineraryHasPassengersWithContractTypeByItineraryIdService.execute({ id_itinerary: "" + itinerary.id_itinerary, contract_type: ItineraryContract.avulse })

    let itineraryInfoType = ''
    if (itineraryHasRecurringPassengers && itineraryHasAvulsePassengers) itineraryInfoType = 'BOTH'
    else {
      if (itineraryHasRecurringPassengers) itineraryInfoType = 'RECURRENT'
      if (itineraryHasAvulsePassengers) itineraryInfoType = 'AVULSE'
    }

    return itineraryInfoType
  }

  // se feed for para passenger
  private getItineraryInfoTypeByPassengerContractType(itinerary: Itinerary, id_user: string): string {
    const passenger = itinerary.passengers.find((passenger) => passenger.user_id === id_user)

    if (!passenger) throw new AppError("Erro.")

    return passenger.contract_type.toString()
  }

  public async execute({ id_user, tripDay, tripType, userType }: Request): Promise<Return[]> {
    tripDay = tripDay.toUpperCase()
    tripType = tripType.toUpperCase()
    userType = userType.toUpperCase()

    if (!Utils.stringIsInEnum(tripDay, TripDay)) throw new AppError("Parâmetro 'tripDay' inválido.")
    if (!Utils.stringIsInEnum(tripType, TripType)) throw new AppError("Parâmetro 'tripType' inválido.")
    if (!Utils.stringIsInEnum(userType, TripUserType)) throw new AppError("Parâmetro 'userType' inválido.")

    const tripsRepository = getRepository(Trip)

    // recupera usuário
    const findUserService = new FindUserService();
    const user = await findUserService.execute(id_user);

    // recupera itinerários do usuário segundo seu userType ('DRIVER', 'PASSENGER')
    let itineraries: Itinerary[] = []
    switch (userType) {
      case TripUserType.driver:
        const findItinerariesByDriverUserIdService = new FindItinerariesByDriverUserIdService()
        itineraries = await findItinerariesByDriverUserIdService.execute(user.id_user)
        break;
      case TripUserType.passenger:
        const findItinerariesByPassengerUserIdService = new FindItinerariesByPassengerUserIdService()
        itineraries = await findItinerariesByPassengerUserIdService.execute(user.id_user)
        break;
      default:
        throw new AppError('O tipo de usuário informado é inválido para recuperar feed de viagens.')
        break;
    }

    // montando feed de rotas
    let tripsFeed: Return[] = []
    for (let index = 0; index < itineraries.length; index++) {
      const itinerary = itineraries[index];

      // filtrando resultados não desejados
      if (!itinerary.is_active) continue

      // verifica itinerários de datas não desejadas
      let isToday: boolean = false
      if (this.checkItineraryHasRecurringTrips(itinerary)) {
        let today = new Date();
        if (itinerary.specific_day?.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)) {
          isToday = true;
        }
      } else if (itinerary.days_of_week) {
        isToday = itinerary.days_of_week.split('').at(DateUtils.getTodaysDayOfWeekAsNumberForSplitComparison()) === '1'
      }

      if (isToday && (tripDay !== TripDay.today)) continue
      if (!isToday && (tripDay !== TripDay.notToday)) continue

      // ver seguintes casos:
      // se é notToday, exibir ida e volta (porque nada ainda vai ter acontecido)

      // se é today...
      // 1. viagem de ida já ainda não aconteceu
      //    (estimated departure time < now)
      // 2. viagem de ida está acontecendo
      //    ((estimated departure time > now && estimated arrival time < now) || (manual confirmation by driver))
      // 3. viagem de ida terminou
      //    (estimated arrival time > now || manual confirmation by driver)

      // 4. viagem de retorno já ainda não aconteceu
      //    (estimated departure time < now)
      // 5. viagem de retorno está acontecendo
      //    ((estimated departure time > now && estimated arrival time < now) || (manual confirmation by driver))
      // 6. viagem de retorno terminou
      //    (estimated arrival time > now || manual confirmation by driver)

      // e ainda...
      // se userType é 'passenger', mostrar se o contrato é recorrente ou avulso
      // se userType é 'driver', mostrar se tiver passageiro recorrente e/ou avulso

      // id_user, tripDay, tripType, userType

      let itineraryInfoType = ''
      switch (userType) {
        case TripUserType.driver:
          itineraryInfoType = await this.getItineraryInfoTypeByItineraryPassengers(itinerary)
          break;
        case TripUserType.passenger:
          itineraryInfoType = this.getItineraryInfoTypeByPassengerContractType(itinerary, user.id_user)
          break;
        default:
          break;
      }

      const currentDate = DateUtils.getCurrentDate()
      const dateConsult = tripDay === TripDay.today ? currentDate : !currentDate

      // aí tenho que ver status da viagem de ida, se ela já existir
      const goingTrip = await tripsRepository.findOne({
        where: { itinerary, date: dateConsult, type: TripType.going },
      });

      let returnObj: Return = {
        itinerary,
        itineraryInfoDriver: itineraryInfoType,

        tripGoing: {
          status: goingTrip ? goingTrip.status : TripStatus.pending,
          id: goingTrip ? goingTrip.id_trip : undefined,
        }
      }

      if (this.checkItineraryHasRecurringTrips(itinerary)) {
        const checkTodaysReturnTripIsAvailable = new CheckTodaysReturnTripIsAvailable()
        const returnTripIsAvailable = await checkTodaysReturnTripIsAvailable.execute("" +itinerary.id_itinerary)

        // aí tenho que ver status da viagem de retorno, se ela já existir
        const todayReturnTrip = await tripsRepository.findOne({
          where: { itinerary, date: dateConsult, type: TripType.return },
        });

        let returnTripStatus: TripStatus = TripStatus.pending
        if (!returnTripIsAvailable) returnTripStatus = TripStatus.unavailable

        returnObj.tripReturn = {
          status: returnTripStatus,
          id: todayReturnTrip ? todayReturnTrip.id_trip : undefined,
        }
      }
    } // for itineraries

    return tripsFeed
  }
}

export default GetUserTripsFeedService;
