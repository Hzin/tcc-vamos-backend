import { getRepository } from 'typeorm';

import AppError from '../../errors/AppError';
import Itinerary from '../../models/Itinerary';

import Trip from '../../models/Trip';
import FindItineraryService from '../Itinerary/FindItineraryService';

class FindTripsServiceByItineraryId {
  public async execute(id_itinerary: string): Promise<Trip[]> {
    const findItineraryService = new FindItineraryService();
    const itinerary = await findItineraryService.execute(id_itinerary)

    if (!itinerary.trips) {
      throw new AppError("Não há viagens registradas para o itinerário informado!")
    }

    return itinerary.trips;
  }
}

export default FindTripsServiceByItineraryId;
