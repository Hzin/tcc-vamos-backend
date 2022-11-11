
import { tripStatus } from '../../constants/tripStatus';
import GetItineraryTodaysTripByItineraryId from './GetItineraryTodaysTripByItineraryId';
import AppError from '../../errors/AppError';

class GetItineraryTodaysTripStatusService {
  public async execute(id_itinerary: string): Promise<tripStatus> {
    const getItineraryTodaysTripByItineraryId = new GetItineraryTodaysTripByItineraryId()

    let todaysTrip: any

    try {
      todaysTrip = await getItineraryTodaysTripByItineraryId.execute(id_itinerary)
    } catch {
      return tripStatus.pending
    }

    if (todaysTrip) return todaysTrip.status
    else throw new AppError("O itinerário informado não possui viagens para hoje.")
  }
}

export default GetItineraryTodaysTripStatusService;
