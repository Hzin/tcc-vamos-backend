import { getRepository } from 'typeorm';
import { TripStatus } from '../../enums/TripStatus';

import AppError from '../../errors/AppError';

import Trip from '../../models/Trip';
import TripHistory from '../../models/TripHistory';
import EnumUtils from '../../services/Utils/EnumUtils';

interface Request {
  id_trip: string;
  new_status: string;
  description: string;
}

class UpdateTripStatusService {
  public async execute({ id_trip, new_status, description }: Request): Promise<TripHistory> {
    const tripsRepository = getRepository(Trip);
    const tripsHistoricRepository = getRepository(TripHistory);

    const trip = await tripsRepository.findOne({
      where: { id_trip },
    });

    if (!trip) {
      throw new AppError('A viagem informada não existe.', 200);
    }

    const oldStatus = trip.status
    const newStatus = EnumUtils.getTripStatusEnumPropertyByValue(new_status)
    
    trip.status = newStatus
    await tripsRepository.save(trip)

    const newTripRecord = tripsHistoricRepository.create({
      trip, old_status: oldStatus, new_status: newStatus, description, 
    });
    await tripsHistoricRepository.save(newTripRecord);

    

    return newTripRecord;
  }
}

export default UpdateTripStatusService;
