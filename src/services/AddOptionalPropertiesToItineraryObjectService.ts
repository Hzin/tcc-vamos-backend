import Itinerary from "../models/Itinerary";
import FindUserService from "./FindUserService";
import FindVehicleService from "./FindVehicleService";

class AddOptionalPropertiesToItineraryObjectService {
  private async addProperties(itinerary: Itinerary): Promise<Itinerary> {
    const findUserService = new FindUserService();
    const findVehicleService = new FindVehicleService();

    itinerary.vehicle = await findVehicleService.execute(itinerary.vehicle_plate)
    itinerary.user = await findUserService.execute(itinerary.vehicle.user_id)

    return itinerary
  }

  public async executeArr(itineraries: Itinerary[]): Promise<Itinerary[]> {
    let newItineraries = itineraries

    for (let i = 0; i < newItineraries.length; i++) {
      const itinerary = newItineraries[i]
      newItineraries[i] = await this.addProperties(itinerary)
    }

    return newItineraries
  }

  public async executeSingle(itinerary: Itinerary): Promise<Itinerary> {
    return this.addProperties(itinerary)
  }
}

export default AddOptionalPropertiesToItineraryObjectService;
