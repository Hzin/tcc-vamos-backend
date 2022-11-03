import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Itinerary from '../models/Itinerary';

class FindItineraryService {
  public async execute(id_itinerary: string): Promise<Itinerary> {
    const itinerariesRepository = getRepository(Itinerary);

    const itinerary = await itinerariesRepository.findOne({
      where: { id_itinerary },
    });

    if (!itinerary) {
      throw new AppError(
        'O itinerário informado não foi encontrado.',
        404,
      );
    }

    return itinerary;
  }
}

export default FindItineraryService;
