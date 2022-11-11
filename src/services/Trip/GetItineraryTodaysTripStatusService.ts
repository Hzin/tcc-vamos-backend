
import { TripStatus } from '../../enums/TripStatus';
import GetItineraryTodaysTripByItineraryId from './GetItineraryTodaysTripByItineraryId';
import AppError from '../../errors/AppError';

class GetItineraryTodaysTripStatusService {
  public async execute(id_itinerary: string): Promise<TripStatus> {
    const getItineraryTodaysTripByItineraryId = new GetItineraryTodaysTripByItineraryId()

    let todaysTrip: any

    try {
      todaysTrip = await getItineraryTodaysTripByItineraryId.execute(id_itinerary)
    } catch {
      return TripStatus.pending
    }

    if (todaysTrip) return todaysTrip.status
    else throw new AppError("O itinerário informado não possui viagens para hoje.")
  }
}

export default GetItineraryTodaysTripStatusService;
