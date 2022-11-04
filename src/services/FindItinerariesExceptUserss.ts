import { getRepository } from "typeorm";

import Itinerary from "../models/Itinerary";
import FindItinerariesByDriverUserIdService from "./FindItinerariesByDriverUserIdService";
import FindItinerariesByPassengerUserIdService from "./FindItinerariesByPassengerUserIdService";

import AddOptionalPropertiesToItineraryObjectService from "./utils/AddOptionalPropertiesToObjectService";

class FindItinerariesExceptUserss {
  public async execute(id_user: string): Promise<Itinerary[]> {
    const itinerariesRepository = getRepository(Itinerary)

    const findItinerariesByDriverUserIdService = new FindItinerariesByDriverUserIdService()
    const itinerariesUserIsInAsDriver = await findItinerariesByDriverUserIdService.execute(id_user)

    const findItinerariesByPassengerUserIdService = new FindItinerariesByPassengerUserIdService()
    const itinerariesUserIsInAsPassenger = await findItinerariesByPassengerUserIdService.execute(id_user)

    let itineraries = await itinerariesRepository.find();
    const itinerariesFiltered = itineraries.filter(itinerary => {
      if (!itinerary.neighborhoods_served || !itinerary.destinations) return false

      if (itinerariesUserIsInAsDriver.some(itineraryUserIsInAsDriver => itineraryUserIsInAsDriver.id_itinerary === itinerary.id_itinerary)) return false
      if (itinerariesUserIsInAsPassenger.some(itineraryUserIsInAsPassenger => itineraryUserIsInAsPassenger.id_itinerary === itinerary.id_itinerary)) return false

      return true
    })

    const addOptionalPropertiesToObjectService = new AddOptionalPropertiesToItineraryObjectService()
    const itinerariesWithOptionalProperties = await addOptionalPropertiesToObjectService.executeArrItinerary(itinerariesFiltered)

    return itinerariesWithOptionalProperties
  }
}

export default FindItinerariesExceptUserss;
