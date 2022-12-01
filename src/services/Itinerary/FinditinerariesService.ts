import { getRepository } from 'typeorm';

import Itinerary from '../../models/Itinerary';

class FinditinerariesService {
  public async execute(): Promise<Itinerary[]> {
    const itinerariesRepository = getRepository(Itinerary);

    const itineraries = await itinerariesRepository.find();
    return itineraries;
  }
}

export default FinditinerariesService;
