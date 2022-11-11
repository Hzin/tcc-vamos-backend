import { getRepository } from 'typeorm';
import { TripStatus } from '../../enums/TripStatus';

import AppError from '../../errors/AppError';

import Trip from '../../models/Trip';
import TripHistory from '../../models/TripHistory';
import FindItineraryService from '../Itinerary/FindItineraryService';
import GetItineraryTodaysTripByItineraryId from './GetItineraryTodaysTripByItineraryId';

import DateUtils from '../utils/Date';

class CreateTripService {
  public async execute(id_itinerary: string, nextStatus: TripStatus): Promise<Trip> {
    const tripsRepository = getRepository(Trip);
    const tripsHistoricRepository = getRepository(TripHistory);

    // verifica se itinerário existe
    const findItineraryService = new FindItineraryService()
    const itinerary = await findItineraryService.execute(id_itinerary);

    // verifica se a viagem de hoje já está criada
    const getItineraryTodaysTripByItineraryId = new GetItineraryTodaysTripByItineraryId()
    let todayTrip: Trip | undefined

    try {
      todayTrip = await getItineraryTodaysTripByItineraryId.execute(id_itinerary);
    } catch { }

    if (todayTrip) throw new AppError('A viagem de hoje do itinerário informado já está criada.', 200);

    // cria viagem
    const trip = tripsRepository.create({
      itinerary, date: DateUtils.getCurrentDate(), status: TripStatus.pending
    });

    await tripsRepository.save(trip);

    // cria 1º histórico de viagem
    const tripHistory1 = tripsHistoricRepository.create({
      trip, new_status: TripStatus.pending, description: 'Criação da viagem'
    });

    let tripHistoryDescription = 'Confirmação da viagem'
    if (nextStatus === TripStatus.canceled) tripHistoryDescription = 'Cancelamento da viagem'

    // cria 2º histórico de viagem
    const tripHistory2 = tripsHistoricRepository.create({
      trip, old_status: TripStatus.pending, new_status: nextStatus, description: tripHistoryDescription
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
