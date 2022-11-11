import FindDriverItinerariesOnlyWithPendingRequests from './FindDriverItinerariesOnlyWithPendingRequests';
import FindUserService from '../FindUserService';

interface Request {
  id_user: string;
}

class CountItinerariesPendingPassengerRequestsByDriverId {
  public async execute({ id_user }: Request): Promise<number> {
    const findUserService = new FindUserService();
    const user = await findUserService.execute(id_user);

    const findDriverItinerariesOnlyWithPendingRequests = new FindDriverItinerariesOnlyWithPendingRequests();
    const itineraries = await findDriverItinerariesOnlyWithPendingRequests.execute(id_user);

    let count = 0

    itineraries.forEach(itinerary => {
      if (!itinerary.passengerRequests) return

      count += itinerary.passengerRequests?.length
    });

    return count
  }
}

export default CountItinerariesPendingPassengerRequestsByDriverId;
