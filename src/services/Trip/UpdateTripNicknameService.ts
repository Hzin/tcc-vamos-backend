import { getRepository } from 'typeorm';

import AppError from '../../errors/AppError';

import Trip from '../../models/Trip';

interface Request {
  id_trip: string;
  nickname: string;
}

class UpdateTripNicknameService {
  public async execute({ id_trip, nickname }: Request): Promise<Trip> {
    const tripsRepository = getRepository(Trip);

    const trip = await tripsRepository.findOne({
      where: { id_trip },
    });

    if (!trip) {
      throw new AppError('A viagem informada não existe.', 200);
    }

    trip.nickname = nickname

    await tripsRepository.save(trip);

    return trip;
  }
}

export default UpdateTripNicknameService;
