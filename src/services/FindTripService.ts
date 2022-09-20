import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Trip from '../models/Trip';

class FindTripService {
  public async execute(id: string): Promise<Trip> {
    const tripsRepository = getRepository(Trip);

    let trip = await tripsRepository.findOne({
      where: { id_trip: id },
    });

    if (!trip) {
      throw new AppError('Viagem não existe.');
    }

    return trip;
  }
}

export default FindTripService;
