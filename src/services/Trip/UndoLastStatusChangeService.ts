import { getRepository } from 'typeorm';

import AppError from '../../errors/AppError';

import Trip from '../../models/Trip';
import TripHistory from '../../models/TripHistory';

interface Request {
  id_trip: string;
}

class UndoLastStatusChangeService {
  public async execute({ id_trip }: Request): Promise<TripHistory> {
    const tripsRepository = getRepository(Trip);
    const tripsHistoriesRepository = getRepository(TripHistory);

    const trip = await tripsRepository.findOne({
      where: { id_trip },
    });

    if (!trip) throw new AppError('A viagem informada não existe.', 200);

    const tripHistories = await tripsHistoriesRepository.find({
      where: { trip_id: id_trip },
    });

    if (!tripHistories || (tripHistories && tripHistories.length <= 2)) {
      throw new AppError(
        'A viagem informada não possui alterações de status o suficiente para desfazer.',
        200,
      );
    }

    const lastTripHistory = tripHistories[tripHistories.length - 2]
    trip.status = lastTripHistory.new_status

    await tripsHistoriesRepository.remove(tripHistories[tripHistories.length - 1]);
    await tripsRepository.save(trip);

    return tripHistories[tripHistories.length - 1];
  }
}

export default UndoLastStatusChangeService;
