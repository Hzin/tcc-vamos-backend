import { getRepository } from "typeorm";

import FindItineraryService from "./FindItineraryService";

import Trip from "../models/Trip";

class FindItineraryTrips {
  public async execute(id_itinerary: string): Promise<Trip[]> {
    const tripsRepository = getRepository(Trip)

    const findItineraryService = new FindItineraryService()
    const itinerary = await findItineraryService.execute(id_itinerary)

    const trips = await tripsRepository.find({ where: { itinerary } })

    return trips
  }
}

export default FindItineraryTrips;
