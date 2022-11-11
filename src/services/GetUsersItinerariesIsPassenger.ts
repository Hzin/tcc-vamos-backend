import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Itinerary from '../models/Itinerary';
import Passenger from '../models/Passenger';
import User from '../models/User';

class GetUsersItinerariesIsPassenger {
  public async execute(id_user: string): Promise<Itinerary[]> {
    const usersRepository = getRepository(User);
    const passengersRepository = getRepository(Passenger);
    let itineraries: Itinerary[] = [];

    const user = await usersRepository.findOne({
      where: { id_user }
    });

    if (!user) {
      throw new AppError('O usuário informado não existe.', 404);
    };

    const userIsPassenger = await passengersRepository.find({
      where: { user },
      relations: ['itinerary']
    });

    itineraries = userIsPassenger.map(passenger => passenger.itinerary);

    return itineraries;
  }
}

export default GetUsersItinerariesIsPassenger;
