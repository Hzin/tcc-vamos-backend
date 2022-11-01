import Itinerary from "../models/Itinerary";
import FindUserService from "./FindUserService";
import FindVehicleService from "./FindVehicleService";

class AddOptionalPropertiesToItineraryObjectService {
  public async execute(itinerary: Itinerary): Promise<Itinerary> {
    const findVehicleService = new FindVehicleService();
    itinerary.vehicle = await findVehicleService.execute(itinerary.vehicle_plate)

    const findUserService = new FindUserService();
    itinerary.user = await findUserService.execute(itinerary.vehicle.user_id)

    return itinerary
  }
}

export default AddOptionalPropertiesToItineraryObjectService;
