import { getRepository, ObjectLiteral } from 'typeorm';

import AppError from '../../errors/AppError';
import Trip from '../../models/Trip';

import FindItineraryService from '../Itinerary/FindItineraryService';

import DateUtils from '../Utils/Date';

interface Request {
  id_itinerary: string,
  tripType: 'going' | 'return'
}

class FindTodaysTripByItineraryIdService {
  public async execute({ id_itinerary, tripType }: Request): Promise<Trip> {
    const tripsRepository = getRepository(Trip);

    const findItineraryService = new FindItineraryService()
    const itinerary = await findItineraryService.execute(id_itinerary)

    let whereConditions: ObjectLiteral | undefined

    switch (tripType) {
      case 'going':
        whereConditions = { itinerary, date: DateUtils.getCurrentDate() }
        break;
      // TODO, fazer
      case 'return':
        whereConditions = { itinerary, date: DateUtils.getCurrentDate() }
        break;
      default:
        throw new AppError("Tipo de viagem inválido.")
        break;
    }

    const trip = await tripsRepository.findOne({
      where: whereConditions
    })

    if (!trip) {
      throw new AppError('O itinerário informado não possui mais viagens para hoje.');
    }

    return trip;
  }
}

export default FindTodaysTripByItineraryIdService;
