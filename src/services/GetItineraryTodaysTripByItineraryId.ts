
import Trip from '../models/Trip';
import FindItineraryService from './FindItineraryService';
import { tripStatus } from '../constants/tripStatus';
import FindTripsServiceByItineraryId from './FindTripsServiceByItineraryId';
import DateUtils from './utils/Date';
import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Itinerary from '../models/Itinerary';

class GetItineraryTodaysTripByItineraryId {
  public async execute(id_itinerary: string): Promise<Trip> {
    const tripsRepository = getRepository(Trip);

    const findItineraryService = new FindItineraryService();
    const itinerary = await findItineraryService.execute(id_itinerary);

    const todayTrip = await tripsRepository.findOne({
      where: { itinerary, date: DateUtils.getCurrentDate() },
    });

    if (!todayTrip) throw new AppError("Não foi encontrada um registro de viagem de hoje para o itinerário informado.")

    return todayTrip
  }
}

export default GetItineraryTodaysTripByItineraryId;
