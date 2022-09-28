import { getRepository } from 'typeorm';
import { tripStatus } from '../constants/tripStatus';

import AppError from '../errors/AppError';
import Itinerary from '../models/Itinerary';

import Trip from '../models/Trip';
import TripHistory from '../models/TripHistory';
import DateUtils from './utils/Date';
import GetTodaysDate from './utils/Date';

class CreateTripService {
  public async execute(id_itinerary: string, nextStatus: tripStatus): Promise<Trip> {
    const tripsRepository = getRepository(Trip);
    const tripsHistoricRepository = getRepository(TripHistory);
    const itinerariesRepository = getRepository(Itinerary);

    const itinerary = await itinerariesRepository.findOne({
      where: { id_itinerary },
    });

    if (!itinerary) {
      throw new AppError('Itinerário informado não existe.', 200);
    }

    const todayDate = DateUtils.getCurrentDate()

    const todayTrip = await tripsRepository.findOne({
      where: { itinerary, date: todayDate },
    });

    if (todayTrip) throw new AppError('A viagem de hoje do itinerário informado já está criada.', 200);

    const trip = tripsRepository.create({
      itinerary, date: todayDate, status: tripStatus.pending
    });

    await tripsRepository.save(trip);

    const tripHistory1 = tripsHistoricRepository.create({
      trip, new_status: tripStatus.pending, description: 'Criação da viagem'
    });

    let tripHistoryDescription = 'Confirmação da viagem'
    if (nextStatus === tripStatus.canceled) tripHistoryDescription = 'Cancelamento da viagem'

    const tripHistory2 = tripsHistoricRepository.create({
      trip, old_status: tripStatus.pending,new_status: nextStatus, description: tripHistoryDescription
    });

    try {
      await tripsHistoricRepository.save(tripHistory1);
    } catch (e) {
      await tripsRepository.delete(trip)
      throw new AppError("Houve um erro ao atualizar 1º histórico de status da viagem.")
    }

    try {
      trip.status = nextStatus
      await tripsRepository.save(trip);
    } catch (e) {
      await tripsHistoricRepository.delete(tripHistory1);
      await tripsRepository.delete(trip)
      throw new AppError("Houve um erro ao atualizar o status da viagem.")
    }

    try {
      await tripsHistoricRepository.save(tripHistory2);
    } catch (e) {
      await tripsHistoricRepository.delete(tripHistory1);
      await tripsRepository.delete(trip)
      throw new AppError("Houve um erro ao atualizar 2º histórico de status da viagem.")
    }


    return trip;
  }
}

export default CreateTripService;
