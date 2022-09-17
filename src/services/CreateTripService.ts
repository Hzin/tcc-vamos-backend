import { getRepository } from 'typeorm';
import { tripStatus } from '../constants/tripStatus';

import AppError from '../errors/AppError';
import Itinerary from '../models/Itinerary';

import Trip from '../models/Trip';
import TripHistory from '../models/TripHistory';

interface Request {
  id_itinerary: string;
}

class CreateTripService {
  public async execute({ id_itinerary }: Request): Promise<Trip> {
    const tripsRepository = getRepository(Trip);
    const tripsHistoricRepository = getRepository(TripHistory);
    const itinerariesRepository = getRepository(Itinerary);

    const itinerary = await itinerariesRepository.findOne({
      where: { id_itinerary },
    });

    if (!itinerary) {
      throw new AppError('Itinerário informado não existe.', 200);
    }

    const trips = await tripsRepository.find({
      where: { itinerary },
    });

    const todayDate = 'HOJE'

    if (trips) {
      trips.map(trip => {
        if (trip.date == todayDate) { // TODO, ajeitar
          throw new AppError('A viagem de hoje do itinerário informado já está criada.', 200);
        }
      })
    }

    const trip = tripsRepository.create({
      itinerary, date: todayDate, status: tripStatus.pending
    });

    const tripHistory = tripsHistoricRepository.create({
      trip, new_status: tripStatus.pending, description: 'Criação da viagem'
    });

    await tripsRepository.save(trip);
    await tripsHistoricRepository.save(tripHistory);

    return trip;
  }
}

export default CreateTripService;
