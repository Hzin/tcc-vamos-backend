
import Itinerary from '../models/Itinerary';
import FindVehiclesByUserIdService from './FindVehiclesByUserIdService';
import FindUserService from './FindUserService';
import { tripStatus } from '../constants/tripStatus';
import GetItineraryTodaysTripStatusService from './GetItineraryTodaysTripStatusService';
import DateUtils from './utils/Date';
import AppError from '../errors/AppError';

interface Return {
  itinerary: Itinerary;
  tripStatus: tripStatus;
}

class GetUserTripsFeedService {
  public async execute(id_user: string, bringTodaysTrips: boolean): Promise<Return[]> {
    const findUserService = new FindUserService();
    const user = await findUserService.execute(id_user);

    const findVehiclesByUserIdService = new FindVehiclesByUserIdService();
    const vehicles = await findVehiclesByUserIdService.execute(user.id_user);

    let userItineraries: Itinerary[] = []

    vehicles.forEach(vehicle => {
      if (vehicle.itineraries) userItineraries.push(...vehicle.itineraries)
    })

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

      const isToday = itinerary.days_of_week.split('').at(DateUtils.getTodaysDayOfWeekAsNumberForSplitComparison()) === '1'
      if (isToday !== bringTodaysTrips) continue

      const getItineraryTodaysTripStatusService = new GetItineraryTodaysTripStatusService()
      const tripStatus = await getItineraryTodaysTripStatusService.execute(itinerary.id_itinerary.toString())

      // se "days_of_week" incluir a data de hoje

      todaysTrips.push({
        itinerary,
        tripStatus
      })
    }

    return todaysTrips
  }
}

export default GetUserTripsFeedService;
