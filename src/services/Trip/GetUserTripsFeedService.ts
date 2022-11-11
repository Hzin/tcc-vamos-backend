
import Itinerary from '../../models/Itinerary';
import FindVehiclesByUserIdService from '../Vehicle/FindVehiclesByUserIdService';
import FindUserService from '../User/FindUserService';
import { tripStatus } from '../../constants/tripStatus';
import GetItineraryTodaysTripStatusService from './GetItineraryTodaysTripStatusService';
import DateUtils from '../utils/Date';
import AppError from '../../errors/AppError';
import GetItineraryTodaysTripByItineraryId from './GetItineraryTodaysTripByItineraryId';
import FindItinerariesByDriverUserIdService from '../Itinerary/FindItinerariesByDriverUserIdService';
import FindItinerariesByPassengerUserIdService from '../Itinerary/FindItinerariesByPassengerUserIdService';

interface Return {
  itinerary: Itinerary;
  tripStatus: tripStatus;
  tripId?: number;
}

interface Request {
  id_user: string,
  tripsType: 'today' | 'not_today',
  userType: 'driver' | 'passenger'
}

class GetUserTripsFeedService {
  public async execute({ id_user, tripsType, userType }: Request): Promise<Return[]> {
    const findUserService = new FindUserService();
    const user = await findUserService.execute(id_user);

    const findVehiclesByUserIdService = new FindVehiclesByUserIdService();
    const vehicles = await findVehiclesByUserIdService.execute(user.id_user);

    let userItineraries: Itinerary[] = []

    switch (userType) {
      case 'driver':
        const findItinerariesByDriverUserIdService = new FindItinerariesByDriverUserIdService()
        userItineraries = await findItinerariesByDriverUserIdService.execute(id_user)
        break;
      case 'passenger':
        const findItinerariesByPassengerUserIdService = new FindItinerariesByPassengerUserIdService()
        userItineraries = await findItinerariesByPassengerUserIdService.execute(id_user)
        break;
      default:
        throw new AppError('Tipo de usuário inválido para recuperar feed de viagens.')
        break;
    }

    // today's trips can have its own status
    // like "late", "ongoing"
    // this status can be only assigned in this filter

    // TODO, acho melhor atualizar os models para colocar ? nos atributos nullable
    // TODO, e alterar a função de criar itinerário do Hugo para não usar mais props

    let todaysTrips: Return[] = []

    for (let index = 0; index < userItineraries.length; index++) {
      const itinerary = userItineraries[index];

      // filtrando resultados não desejados
      if (!itinerary.is_active) continue
      if (!itinerary.days_of_week) continue

      let isToday: boolean = false

      // verifica dia específico
      if (!itinerary.days_of_week || itinerary.days_of_week === '0000000') {
        let today = new Date();
        if (itinerary.specific_day?.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)) {
          isToday = true;
        }
      } else {
        isToday = itinerary.days_of_week.split('').at(DateUtils.getTodaysDayOfWeekAsNumberForSplitComparison()) === '1'
      }

      if (isToday && (tripsType !== 'today')) continue

      const getItineraryTodaysTripStatusService = new GetItineraryTodaysTripStatusService()
      const tripStatus = await getItineraryTodaysTripStatusService.execute(itinerary.id_itinerary.toString())

      const getItineraryTodaysTripByItineraryId = new GetItineraryTodaysTripByItineraryId()
      let tripId: number | undefined

      try {
        const trip = await getItineraryTodaysTripByItineraryId.execute(itinerary.id_itinerary.toString())
        tripId = trip.id_trip
      } catch {
        tripId = undefined
      }

      todaysTrips.push({
        itinerary,
        tripStatus,
        tripId: tripId
      })
    }

    return todaysTrips
  }
}

export default GetUserTripsFeedService;
