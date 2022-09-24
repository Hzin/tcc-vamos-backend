
import Trip from '../models/Trip';
import FindItineraryService from './FindItineraryService';
import { tripStatus } from '../constants/tripStatus';
import FindTripService from './FindTripService';
import FindTripsServiceByItineraryId from './FindTripsServiceByItineraryId';
import DateUtils from './utils/Date';

class GetItineraryTodaysTripStatusService {
  public async execute(id_itinerary: string): Promise<tripStatus> {
    const findItineraryService = new FindItineraryService();
    const itinerary = await findItineraryService.execute(id_itinerary);

    // today's trips can have its own status
    // like "late", "ongoing"
    // this status can be only assigned in this filter

    const findTripService = new FindTripService();

    let itineraryTrips: Trip[]
    let itineraryTodaysTrip: Trip | undefined = undefined

    try {
      const findTripsServiceByItineraryId = new FindTripsServiceByItineraryId();
      itineraryTrips = await findTripsServiceByItineraryId.execute(id_itinerary);
    } catch {
      return tripStatus.pending
    }

    for (let i = 0; i < itineraryTrips.length; i++) {
      const itineraryTrip = itineraryTrips[i]
      // itineraryTrips.forEach(itineraryTrip => {
      if (itineraryTrip.date === DateUtils.getCurrentDate()) {
        itineraryTodaysTrip = itineraryTrip
        break
      }
    }
    // )

    if (!itineraryTodaysTrip) return tripStatus.pending

    return itineraryTodaysTrip.status
  }
}

export default GetItineraryTodaysTripStatusService;
