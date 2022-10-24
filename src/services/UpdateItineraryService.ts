import { getRepository, UpdateResult } from 'typeorm';

import AppError from '../errors/AppError';

import Itinerary from '../models/Itinerary';
import NeighborhoodServed from '../models/NeighborhoodServed';
import Destination from '../models/Destination';
import FindVehicleService from './FindVehicleService';

interface Request {
  id: number,
  vehicle_plate?: string;
  days_of_week?: string;
  specific_day?: string;
  estimated_departure_time?: string;
  estimated_arrival_time?: string;
  monthly_price?: number;
  daily_price?: number;
  accept_daily?: boolean;
  itinerary_nickname?: string;
  estimated_departure_address?: string;
  departure_latitude?: number;
  departure_longitude?: number;
  neighborhoods_served?: NeighborhoodServed[];
  destinations?: Destination[];
  is_active?: boolean;
}

class UpdateItineraryService {
  public async execute(props: Request): Promise<UpdateResult> {
    let vehicle;
    const { id, vehicle_plate, ...infos } = props;
    
    const itinerariesRepository = getRepository(Itinerary);

    const old_itinerary = await itinerariesRepository.findOne(id);

    if (!old_itinerary) {
      throw new AppError('Itinerário não encontrado!', 404);
    }

    if (vehicle_plate) {
      const findVehicleService = new FindVehicleService();
      vehicle = await findVehicleService.execute(vehicle_plate);
    } else {
      vehicle = old_itinerary.vehicle;
    }

    // TODO, verificar se o período já está ocupado para a placa da vehicle informada!
    const checkAvailability = await itinerariesRepository.findOne({
      where: {
        vehicle,
        days_of_week: infos.days_of_week ? infos.days_of_week : old_itinerary.days_of_week,
        specific_day: infos.specific_day ? infos.specific_day : old_itinerary.specific_day,
        estimated_departure_time: infos.estimated_departure_time ? infos.estimated_departure_time : old_itinerary.estimated_departure_time,
        is_active: true
      },
    });

    if (checkAvailability) {
      throw new AppError('Não foi possível atualizar esse itinerário. Verifique os itinerários já cadastrados para essa van para evitar conflitos de horário e/ou dias!', 400);
    }

    // formata data
    if (infos.specific_day) {
      infos.specific_day = infos.specific_day.replace(/\//g, '-');
      infos.specific_day = infos.specific_day.replace(/(\d{2})\-(\d{2})\-(\d{4}).*/, '$2-$1-$3');
    }

    const available_seats = vehicle ? Number(vehicle.seats_number) : 0;

    const itinerary = itinerariesRepository.update(id, { ...infos, vehicle, available_seats });

    return itinerary;
  }
}

export default UpdateItineraryService;
