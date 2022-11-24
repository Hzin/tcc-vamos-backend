import FindTripService from './FindTripService';
import TripHistory from '../../models/TripHistory';

interface Request {
  id_trip: string;
}

class FindTripHistoricService {
  public async execute({ id_trip }: Request): Promise<TripHistory[]> {
    const findTripService = new FindTripService();
    const trip = await findTripService.execute(id_trip);

    console.log(trip)

    if (!trip.trip_histories) return []
    return trip.trip_histories;
  }
}

export default FindTripHistoricService;
