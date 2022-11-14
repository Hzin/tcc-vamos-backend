import FindItineraryService from "../Itinerary/FindItineraryService";
import FindTodaysTripByItineraryIdService from "./FindTodaysTripByItineraryIdService";
import { TripStatus } from "../../enums/TripStatus";

class CheckTodaysReturnTripIsAvailable {
  public async execute(id_itinerary: string): Promise<boolean> {
    const findItineraryService = new FindItineraryService()
    const itinerary = await findItineraryService.execute(id_itinerary)

    const findTodaysTripByItineraryIdService = new FindTodaysTripByItineraryIdService()
    const todaysGoingTrip = await findTodaysTripByItineraryIdService.execute({ id_itinerary: "" + itinerary.id_itinerary, tripType: 'going' })

    if (todaysGoingTrip.status === TripStatus.finished) return true

    return false
  }
}

export default CheckTodaysReturnTripIsAvailable;
