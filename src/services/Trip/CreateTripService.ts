import { getRepository, ObjectLiteral } from 'typeorm';
import { TripStatus } from '../../enums/TripStatus';

import AppError from '../../errors/AppError';

import Trip from '../../models/Trip';
import TripHistory from '../../models/TripHistory';
import FindItineraryService from '../Itinerary/FindItineraryService';

import EnumUtils from '../../services/Utils/EnumUtils';
import DateUtils from '../Utils/Date';

import { TripType } from '../../enums/TripType';

interface Request {
  id_itinerary: string,
  tripType: string,
  newTripStatus: string
}

interface Response {
  trip: Trip,
  message: string,
}

// assume-se today para tripDay
class CreateTripService {
  public async execute({ id_itinerary, tripType, newTripStatus }: Request): Promise<Response> {
    tripType = tripType.toUpperCase()
    newTripStatus = newTripStatus.toUpperCase()

    if (!EnumUtils.stringIsInEnum(tripType, TripType)) throw new AppError("Tipo de viagem inválido.")
    if (!EnumUtils.stringIsInEnum(newTripStatus, TripStatus)) throw new AppError("Status de viagem inválido.")

    let newTripStatusProperty: TripStatus
    switch (newTripStatus) {
      case TripStatus.confirmed:
        newTripStatusProperty = TripStatus.confirmed
        break;
      case TripStatus.canceled:
        newTripStatusProperty = TripStatus.canceled
        break;
      default:
        throw new AppError("Status de criação de viagem inválido.")
        break;
    }

    const tripsRepository = getRepository(Trip);
    const tripsHistoricRepository = getRepository(TripHistory);

    // verifica se itinerário existe
    const findItineraryService = new FindItineraryService()
    const itinerary = await findItineraryService.execute(id_itinerary);

    // verifica se a viagem de hoje já está criada
    let whereCondition: ObjectLiteral
    switch (tripType) {
      case TripType.going:
        whereCondition = { itinerary, type: TripType.going, date: DateUtils.getCurrentDate() }
        break;
      case TripType.return:
        whereCondition = { itinerary, type: TripType.return, date: DateUtils.getCurrentDate() }
        break;

      default:
        throw new AppError('Tipo de viagem inválido.', 200);
        break;
    }

    const todayTrip = await tripsRepository.findOne({ where: whereCondition });

    if (todayTrip) throw new AppError('A viagem de hoje do itinerário informado já está criada.', 200);

    // cria viagem
    const trip = tripsRepository.create({
      itinerary, date: DateUtils.getCurrentDate(), status: TripStatus.pending, type: tripType
    });

    await tripsRepository.save(trip);

    // cria 1º histórico de viagem
    const tripHistory1 = tripsHistoricRepository.create({
      trip, new_status: TripStatus.pending, description: 'Criação da viagem'
    });

    let tripHistoryDescription = 'Confirmação da viagem'
    if (newTripStatusProperty === TripStatus.canceled) tripHistoryDescription = 'Cancelamento da viagem'

    // cria 2º histórico de viagem
    const tripHistory2 = tripsHistoricRepository.create({
      trip, old_status: TripStatus.pending, new_status: newTripStatusProperty, description: tripHistoryDescription
    });

    try {
      await tripsHistoricRepository.save(tripHistory1);
    } catch (e) {
      await tripsRepository.delete(trip)
      throw new AppError("Houve um erro ao atualizar 1º histórico de status da viagem. A viagem não será atualizada.")
    }

    try {
      trip.status = newTripStatusProperty
      await tripsRepository.save(trip);
    } catch (e) {
      await tripsHistoricRepository.delete(tripHistory1);
      await tripsRepository.delete(trip)
      throw new AppError("Houve um erro ao atualizar o status da viagem. A viagem não será atualizada.")
    }

    try {
      await tripsHistoricRepository.save(tripHistory2);
    } catch (e) {
      await tripsHistoricRepository.delete(tripHistory1);
      await tripsRepository.delete(trip)
      throw new AppError("Houve um erro ao atualizar 2º histórico de status da viagem. A viagem não será atualizada.")
    }

    let message = "Viagem confirmada com sucesso!"
    if (newTripStatusProperty === TripStatus.canceled) message = "Viagem cancelada com sucesso"

    return {
      trip,
      message
    };
  }
}

export default CreateTripService;
