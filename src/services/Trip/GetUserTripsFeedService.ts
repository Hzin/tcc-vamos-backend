
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

interface GetFeedForDriverProps {
  itinerary: Itinerary,
}

interface GetFeedForPassengerProps {
  itinerary: Itinerary,
  user: User,
}

interface Request {
  id_user: string,
  tripDay: string,
  tripType: string,
  userType: string,
}

interface Return {
  itinerary: Itinerary;
  // itineraryInfoDriver?: 'recurring' | 'specific_day' | 'both' | undefined;
  // itineraryInfoPassenger?: 'avulse' | 'recurring' | undefined;
  itineraryInfoDriver?: string,
  itineraryInfoPassenger?: string,

  tripStatus: TripStatus;
  tripType: TripType;
  tripId?: number; // é opcional porque a viagem pode ainda não ter sido criada
}

class GetUserTripsFeedService {
  public async execute({ id_user, tripDay, tripType, userType }: Request): Promise<Return[]> {
    if (!Utils.stringIsInEnum(tripDay, TripDay)) throw new AppError("Parâmetro 'tripDay' inválido.")
    if (!Utils.stringIsInEnum(tripType, TripType)) throw new AppError("Parâmetro 'tripType' inválido.")
    if (!Utils.stringIsInEnum(userType, TripUserType)) throw new AppError("Parâmetro 'userType' inválido.")

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
      if (!itinerary.days_of_week || itinerary.days_of_week === '0000000') {
        let today = new Date();
        if (itinerary.specific_day?.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)) {
          isToday = true;
        }
      } else {
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

      switch (tripDay) {
        case TripDay.today:
          if (userType === TripUserType.driver) {
            tripsFeed = tripsFeed.concat(await this.getFeedForDriverToday({ itinerary }))
          }

          if (userType === TripUserType.passenger) {
            tripsFeed = tripsFeed.concat(await this.getFeedForPassengerToday({ user, itinerary }))
          }
          break;

        case TripDay.notToday:
          if (userType === TripUserType.driver) {
            tripsFeed = tripsFeed.concat(await this.getFeedForDriverNotToday({ itinerary }))
          }

          if (userType === TripUserType.passenger) {
            tripsFeed = tripsFeed.concat(await this.getFeedForPassengerNotToday({ user, itinerary }))
          }
          break;

        default:
          throw new AppError("Dia de viagem inválido.")
          break;
      }
    } // for itineraries

    return tripsFeed
  }

  // se feed for para driver
  private async getItineraryInfoTypeByItineraryPassengers(itinerary: Itinerary): Promise<string> {
    const itineraryHasPassengersWithContractTypeByItineraryIdService = new ItineraryHasPassengersWithContractTypeByItineraryIdService()

    const itineraryHasRecurringPassengers = await itineraryHasPassengersWithContractTypeByItineraryIdService.execute({ id_itinerary: "" + itinerary.id_itinerary, contract_type: ItineraryContract.recurring })
    const itineraryHasAvulsePassengers = await itineraryHasPassengersWithContractTypeByItineraryIdService.execute({ id_itinerary: "" + itinerary.id_itinerary, contract_type: ItineraryContract.avulse })

    let itineraryInfoType = ''
    if (itineraryHasRecurringPassengers && itineraryHasAvulsePassengers) itineraryInfoType = 'both'
    else {
      if (itineraryHasRecurringPassengers) itineraryInfoType = 'recurrent'
      if (itineraryHasAvulsePassengers) itineraryInfoType = 'specific_day'
    }

    return itineraryInfoType
  }

  // se feed for para passenger
  private getItineraryInfoTypeByPassengerContractType(itinerary: Itinerary, id_user: string): string {
    const passenger = itinerary.passengers.find((passenger) => passenger.user_id === id_user)

    if (!passenger) throw new AppError("Erro.")

    return passenger.contract_type.toString().toLowerCase()
  }

  private async getFeedForDriverToday({ itinerary }: GetFeedForDriverProps): Promise<Return[]> {
    let tripsFeed: Return[] = []

    const tripsRepository = getRepository(Trip)

    const itineraryInfoType = await this.getItineraryInfoTypeByItineraryPassengers(itinerary)

    // aí tenho que ver status da viagem de ida, se ela já existir
    const todayGoingTrip = await tripsRepository.findOne({
      where: { itinerary, date: DateUtils.getCurrentDate(), type: TripType.going },
    });
    tripsFeed.push({
      itinerary,
      itineraryInfoDriver: itineraryInfoType,

      tripType: TripType.going,
      tripStatus: todayGoingTrip ? todayGoingTrip.status : TripStatus.pending
    })

    // aí tenho que ver status da viagem de retorno, se ela já existir
    const todayReturnTrip = await tripsRepository.findOne({
      where: { itinerary, date: DateUtils.getCurrentDate(), type: TripType.return },
    });
    tripsFeed.push({
      itinerary,
      itineraryInfoDriver: itineraryInfoType,

      tripType: TripType.return,
      tripStatus: todayReturnTrip ? todayReturnTrip.status : TripStatus.pending
    })

    return tripsFeed
  }

  private async getFeedForDriverNotToday({ itinerary }: GetFeedForDriverProps): Promise<Return[]> {
    let tripsFeed: Return[] = []

    const itineraryInfoType = await this.getItineraryInfoTypeByItineraryPassengers(itinerary)

    tripsFeed.push({
      itinerary,
      itineraryInfoDriver: itineraryInfoType,

      tripType: TripType.going,
      tripStatus: TripStatus.pending
    })

    tripsFeed.push({
      itinerary,
      itineraryInfoDriver: itineraryInfoType,

      tripType: TripType.return,
      tripStatus: TripStatus.pending
    })

    return tripsFeed
  }

  private async getFeedForPassengerToday({ itinerary, user }: GetFeedForPassengerProps): Promise<Return[]> {
    let tripsFeed: Return[] = []

    const tripsRepository = getRepository(Trip)

    const itineraryInfoType = this.getItineraryInfoTypeByPassengerContractType(itinerary, user.id_user)

    // aí tenho que ver status da viagem de ida, se ela já existir
    const todayGoingTrip = await tripsRepository.findOne({
      where: { itinerary, date: DateUtils.getCurrentDate(), type: TripType.going },
    });
    tripsFeed.push({
      itinerary,
      itineraryInfoPassenger: itineraryInfoType,

      tripType: TripType.going,
      tripStatus: todayGoingTrip ? todayGoingTrip.status : TripStatus.pending
    })

    // aí tenho que ver status da viagem de retorno, se ela já existir
    const todayReturnTrip = await tripsRepository.findOne({
      where: { itinerary, date: DateUtils.getCurrentDate(), type: TripType.return },
    });
    tripsFeed.push({
      itinerary,
      itineraryInfoPassenger: itineraryInfoType,

      tripType: TripType.return,
      tripStatus: todayReturnTrip ? todayReturnTrip.status : TripStatus.pending
    })

    return tripsFeed
  }

  private async getFeedForPassengerNotToday({ itinerary, user }: GetFeedForPassengerProps): Promise<Return[]> {
    let tripsFeed: Return[] = []

    const itineraryInfoType = this.getItineraryInfoTypeByPassengerContractType(itinerary, user.id_user)

    tripsFeed.push({
      itinerary,
      itineraryInfoPassenger: itineraryInfoType,

      tripType: TripType.going,
      tripStatus: TripStatus.pending
    })

    tripsFeed.push({
      itinerary,
      itineraryInfoPassenger: itineraryInfoType,

      tripType: TripType.return,
      tripStatus: TripStatus.pending
    })

    return tripsFeed
  }
}

export default GetUserTripsFeedService;
