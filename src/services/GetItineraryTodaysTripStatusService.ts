
import Trip from '../models/Trip';
import FindItineraryService from './FindItineraryService';
import { tripStatus } from '../constants/tripStatus';
import FindTripsServiceByItineraryId from './FindTripsServiceByItineraryId';
import DateUtils from './utils/Date';
import GetItineraryTodaysTripByItineraryId from './GetItineraryTodaysTripByItineraryId';

class GetItineraryTodaysTripStatusService {
  public async execute(id_itinerary: string): Promise<tripStatus> {
    const getItineraryTodaysTripByItineraryId = new GetItineraryTodaysTripByItineraryId()

    let todaysTrip: any

    try {
      todaysTrip = await getItineraryTodaysTripByItineraryId.execute(id_itinerary)
    } catch {
      return tripStatus.pending
    }

    return todaysTrip.status
  }
}

export default GetItineraryTodaysTripStatusService;
