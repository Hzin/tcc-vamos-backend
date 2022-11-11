import { getRepository } from 'typeorm';

import AppError from '../../errors/AppError';

import Passenger from '../../models/Passenger';

class FindPassengerService {
  public async execute(itinerary_id: string, user_id: string): Promise<Passenger> {
    const passengersRepository = getRepository(Passenger);

    const passenger = await passengersRepository.findOne({
      where: { itinerary_id, user_id },
    });

    if (!passenger) {
      throw new AppError('O passageiro informado não foi encontrado.')
    }

    return passenger;
  }
}

export default FindPassengerService;
