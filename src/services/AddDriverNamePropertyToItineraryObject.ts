import Itinerary from "../models/Itinerary";
import GetDriverNameOfItinerary from "./GetDriverNameOfItineraryService";

class AddDriverNamePropertyToItineraryObject {
  public async execute(itinerary: Itinerary): Promise<Itinerary> {
    const getDriverNameOfItinerary = new GetDriverNameOfItinerary();
    const driverName = await getDriverNameOfItinerary.execute(itinerary.id_itinerary)

    itinerary.driverName = driverName

    return itinerary
  }
}

export default AddDriverNamePropertyToItineraryObject;
