import { getRepository } from "typeorm";

import Itinerary from "../../models/Itinerary";

import FindUserService from "../User/FindUserService";
import FindVehiclesByUserIdService from "../Vehicle/FindVehiclesByUserIdService";

class FindItinerariesByDriverUserIdService {
  public async execute(id_user: string): Promise<Itinerary[]> {
    const itinerariesRepository = getRepository(Itinerary)

    const findUserService = new FindUserService()
    const user = await findUserService.execute(id_user)

    const findVehiclesByUserIdService = new FindVehiclesByUserIdService()
    const vehicles = await findVehiclesByUserIdService.execute(user.id_user)
    const vehiclesPlates = vehicles.map((vehicle) => vehicle.plate)

    const itineraries = await itinerariesRepository.find()
    const driverItineraries = itineraries.filter((itinerary) => vehiclesPlates.includes(itinerary.vehicle_plate))

    return driverItineraries
  }
}

export default FindItinerariesByDriverUserIdService;
