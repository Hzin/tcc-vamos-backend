
import Itinerary from '../models/Itinerary';
import FindVehiclesByUserIdService from './FindVehiclesByUserIdService';
import FindUserService from './FindUserService';
import { tripStatus } from '../constants/tripStatus';
import GetItineraryTodaysTripStatusService from './GetItineraryTodaysTripStatusService';
import DateUtils from './utils/Date';
import GetItineraryTodaysTripByItineraryId from './GetItineraryTodaysTripByItineraryId';
import GetUsersItinerariesIsPassenger from './GetUsersItinerariesIsPassenger';

interface Return {
  itinerary: Itinerary;
  tripStatus: tripStatus;
  tripId?: number;
  isPassenger: boolean;
}

class GetUserTripsFeedService {
  public async execute(id_user: string, bringTodaysTrips: boolean): Promise<Return[]> {
    let todaysTrips: Return[] = []
    const findUserService = new FindUserService();
    const user = await findUserService.execute(id_user);
    const findVehiclesByUserIdService = new FindVehiclesByUserIdService();
    const get_user_itineraries_is_passenger = new GetUsersItinerariesIsPassenger();
    const vehicles = await findVehiclesByUserIdService.execute(user.id_user);

    let userItineraries: Itinerary[] = []

    if (vehicles.length > 0) {
      vehicles.forEach(vehicle => {
        if (vehicle.itineraries) userItineraries.push(...vehicle.itineraries)
      })
    }

    // today's trips can have its own status
    // like "late", "ongoing"
    // this status can be only assigned in this filter

    // TODO, acho melhor atualizar os models para colocar ? nos atributos nullable
    // TODO, e alterar a função de criar itinerário do Hugo para não usar mais props
    
    for (let index = 0; index < userItineraries.length; index++) {
      const itinerary = userItineraries[index];
      let isToday: boolean = false;
      // filtrando resultados não desejados
      if (!itinerary.is_active) continue

      if (!itinerary.days_of_week || itinerary.days_of_week === '0000000'){
        let today = new Date();
        if(itinerary.specific_day?.setHours(0,0,0,0) == today.setHours(0,0,0,0)) {
          isToday = true;
        }
      } else {
        isToday = itinerary.days_of_week.split('').at(DateUtils.getTodaysDayOfWeekAsNumberForSplitComparison()) === '1'
      }

      if (isToday !== bringTodaysTrips) continue

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
        tripId: tripId,
        isPassenger: false,
      })
    }

    // Pega só os itinerários que o usuário é passageiro
    const userIsPassenger = await get_user_itineraries_is_passenger.execute(user.id_user);
    for (let index = 0; index < userIsPassenger.length; index++) {
      const itinerary = userIsPassenger[index];
      let isToday: boolean = false;
      // filtrando resultados não desejados
      if (!itinerary.is_active) continue

      if (!itinerary.days_of_week || itinerary.days_of_week === '0000000'){
        let today = new Date();
        if(itinerary.specific_day?.setHours(0,0,0,0) == today.setHours(0,0,0,0)) {
          isToday = true;
        }
      } else {
        isToday = itinerary.days_of_week.split('').at(DateUtils.getTodaysDayOfWeekAsNumberForSplitComparison()) === '1'
      }

      if (isToday !== bringTodaysTrips) continue

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
        tripId: tripId,
        isPassenger: true,
      })
    }

    return todaysTrips
  }
}

export default GetUserTripsFeedService;
