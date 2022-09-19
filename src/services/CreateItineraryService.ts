import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Itinerary from '../models/Itinerary';
import NeighborhoodServed from '../models/NeighborhoodServed';
import Destination from '../models/Destination';
import FindVehicleService from './FindVehicleService';
import Vehicle from '../models/Vehicle';

interface Request {
  vehicle_plate: string;
  days_of_week?: string;
  specific_day?: string;
  estimated_departure_time: string;
  estimated_arrival_time: string;
  // available_seats: number;
  monthly_price: number;
  daily_price?: number;
  accept_daily: boolean;
  itinerary_nickname: string;
  estimated_departure_address: string;
  departure_latitude: number;
  departure_longitude: number;
  neighborhoods_served: NeighborhoodServed[];
  destinations: Destination[];
}

class CreateItineraryService {
  public async execute(props: Request): Promise<Itinerary> {
    const vehiclesRepository = getRepository(Vehicle);
    const itinerariesRepository = getRepository(Itinerary);

    const findVehicle = new FindVehicleService();
    const vehicle = await findVehicle.execute(props.vehicle_plate);

    // TODO, verificar se o período já está ocupado para a placa da vehicle informada!
    const checkAvailability = await itinerariesRepository.findOne({
      where: {
        vehicle,
        days_of_week: props.days_of_week ? props.days_of_week : null,
        specific_day: props.specific_day ? props.specific_day : null,
        estimated_departure_time: props.estimated_departure_time,
        is_active: true
      },
    });

    if (checkAvailability) {
      throw new AppError('Não foi possível cadastrar esse itinerário. Verifique os itinerários já cadastrados para essa van para evitar conflitos de horário e/ou dias!', 400);
    }

    //Formata data
    if (props.specific_day) {
      props.specific_day = props.specific_day.replace(/\//g, '-');
      props.specific_day = props.specific_day.replace(/(\d{2})\-(\d{2})\-(\d{4}).*/, '$2-$1-$3');
    }

    const available_seats = vehicle ? Number(vehicle.seats_number) : 0;
    const is_active = true;

    const itinerary = itinerariesRepository.create({...props, vehicle, available_seats, is_active});
    await itinerariesRepository.save(itinerary);

    return itinerary;
  }
}

export default CreateItineraryService;
