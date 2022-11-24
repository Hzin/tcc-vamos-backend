import { getRepository } from 'typeorm';
import { TripStatus } from '../../enums/TripStatus';

import AppError from '../../errors/AppError';

import Trip from '../../models/Trip';
import TripHistory from '../../models/TripHistory';
import UpdateTripStatusService from './UpdateTripStatusService';

import EnumUtils from '../../services/Utils/EnumUtils';

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
      where: { trip },
    });

    if (!tripHistories || (tripHistories && tripHistories.length <= 2)) {
      throw new AppError(
        'A viagem informada não possui alterações de status o suficiente para desfazer.',
        200,
      );
    }

    const lastTripHistory = tripHistories[tripHistories.length - 2]
    const updateTripStatusService = new UpdateTripStatusService()
    const tripHistory = await updateTripStatusService.execute({ id_trip, new_status: lastTripHistory.new_status, description: 'Desfazendo o cancelamento da viagem' })

    return tripHistory
  }
}

export default UndoLastStatusChangeService;
