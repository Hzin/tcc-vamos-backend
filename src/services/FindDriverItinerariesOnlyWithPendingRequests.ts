import { passengerRequestStatusTypes } from "../constants/passengerRequestStatusTypes";
import Itinerary from "../models/Itinerary";
import FindItinerariesByDriverUserIdService from "./FindItinerariesByDriverUserIdService";

class FindDriverItinerariesOnlyWithPendingRequests {
  public async execute(id_user: string): Promise<Itinerary[]> {
    const findItinerariesByDriverUserIdService = new FindItinerariesByDriverUserIdService()
    let itineraries = await findItinerariesByDriverUserIdService.execute(id_user)

    itineraries.forEach(itinerary => {
      itinerary.passengerRequests = itinerary.passengerRequests?.filter(passengerRequest => {
        if (passengerRequest.status !== passengerRequestStatusTypes.pending) return false

        return true
      })
    })

    return itineraries
  }
}

export default FindDriverItinerariesOnlyWithPendingRequests;
