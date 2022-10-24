import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Trip from '../models/Trip';

import FindItineraryService from './FindItineraryService';
import DateUtils from './utils/Date';

class FindTodaysTripByItineraryIdService {
  public async execute(id_itinerary: string): Promise<Trip> {
    const tripsRepository = getRepository(Trip);

    const findItineraryService = new FindItineraryService()
    const itinerary = await findItineraryService.execute(id_itinerary)

    const trip = await tripsRepository.findOne({
      where: { itinerary, date: DateUtils.getCurrentDate() }
    })

    if (!trip) {
      throw new AppError('O itinerário informado não possui uma viagem criada para hoje.');
    }

    return trip;
  }
}

export default FindTodaysTripByItineraryIdService;
