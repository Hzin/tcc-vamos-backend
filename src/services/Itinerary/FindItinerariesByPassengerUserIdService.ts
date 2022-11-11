import { getRepository } from "typeorm";

import Itinerary from "../../models/Itinerary";
import FindUserService from "../FindUserService";

class FindItinerariesByPassengerUserIdService {
  public async execute(id_user: string): Promise<Itinerary[]> {
    const itinerariesRepository = getRepository(Itinerary)

    const findUserService = new FindUserService()
    const user = await findUserService.execute(id_user)

    const itineraries = await itinerariesRepository.find()
    const passengerItineraries = itineraries.filter((itinerary) => {
      if (!itinerary.passengers) return false

      return itinerary.passengers.some((passenger) => passenger.user_id === user.id_user)
    })

    return passengerItineraries
  }
}

export default FindItinerariesByPassengerUserIdService;
