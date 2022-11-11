import { getRepository } from "typeorm";

import { passengerRequestStatusTypes } from "../../constants/passengerRequestStatusTypes";
import PassengerRequest from "../../models/PassengerRequest";
import FindItineraryService from "./FindItineraryService";

class FindItineraryPendingRequests {
  public async execute(id_itinerary: string): Promise<PassengerRequest[]> {
    const passengerRequestsRepository = getRepository(PassengerRequest)

    const findItineraryService = new FindItineraryService()
    const itinerary = await findItineraryService.execute(id_itinerary);

    const pendingItineraryRequests = await passengerRequestsRepository.find(
      { where: { itinerary, status: passengerRequestStatusTypes.pending } }
    )

    return pendingItineraryRequests
  }
}

export default FindItineraryPendingRequests;
