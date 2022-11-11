import { getRepository } from 'typeorm';

import AppError from '../../errors/AppError';
import User from '../../models/User';
import Trip from '../../models/Trip';

interface Request {
  id_user: string;
}

class GetUserTrips {
  public async execute(id_user: string): Promise<Trip[]> {
    const usersRepository = getRepository(User);
    const tripsRepository = getRepository(Trip);

    const user = await usersRepository.findOne({
      where: { id_user }
    });

    if (!user) {
      throw new AppError('O usuário informado não existe.', 404);
    };

    const trips = await tripsRepository.find({
      where: { user }
    });

    return trips;
  }
}

export default GetUserTrips;
