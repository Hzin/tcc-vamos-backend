
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
import Trip from '../../models/Trip';
import { getRepository, ObjectLiteral } from 'typeorm';

interface Request {
  id_user: string,
  tripDay: string,
  tripType: string,
  userType: string,
}

interface Return {
  itinerary: Itinerary;
  itineraryInfo: {
    type: 'recurrent' | 'specific_day',
    value: string;
  }

  trips: {
    tripStatus: TripStatus;
    tripType: TripType;
    tripId?: number;
  }[]
}

class GetUserTripsFeedService {
  public async execute({ id_user, tripDay, tripType, userType }: Request): Promise<Return[]> {
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

      // recuperando
      // let whereCondition: ObjectLiteral
      // switch (tripDay) {
      //   case TripDay.today:
      //     whereCondition = { itinerary, date: DateUtils.getCurrentDate() }
      //     break;
      //   case TripDay.notToday:
      //     // TODO, sinal de exclamação funciona?
      //     whereCondition = { itinerary, date: !DateUtils.getCurrentDate() }
      //     break;
      //   default:
      //     break;
      // }
      // const trips = await tripsRepository.find({
      //   where: { itinerary, date: DateUtils.getCurrentDate() },
      // });

      // ver seguintes casos:
      // se é notToday, exibir ida e volta (porque nada ainda vai ter acontecido)
      // se é today...
      // 1. viagem de ida já ainda não aconteceu
      //    (estimated departure time < now)
      // 2. viagem de ida está acontecendo
      //    ((estimated departure time > now && estimated arrival time < now) || (manual confirmation by driver))
      // 3. viagem de ida terminou
      //    (estimated arrival time > now || manual confirmation by driver)
      // daí informo isso no vetor Response

      // 4. viagem de retorno já ainda não aconteceu
      //    (estimated departure time < now)
      // 5. viagem de retorno está acontecendo
      //    ((estimated departure time > now && estimated arrival time < now) || (manual confirmation by driver))
      // 6. viagem de retorno terminou
      //    (estimated arrival time > now || manual confirmation by driver)
    }

    // TODO, desfazer
    let todayTripsFeed: Return[] = []
    return todayTripsFeed
  }
}

export default GetUserTripsFeedService;
