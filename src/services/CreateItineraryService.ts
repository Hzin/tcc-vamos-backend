import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Itinerary from '../models/Itinerary';
import NeighborhoodServed from '../models/NeighborhoodServed';
import Destination from '../models/Destination';

interface Request {
  id_itinerary: number,
  vehicle_plate: string,
  price: number,
  days_of_week: string,
  specific_day: Date | undefined,
  estimated_departure_time: string,
  estimated_arrival_time: string,
  available_seats: number,
  itinerary_nickname: string,
  is_active: boolean;
  estimated_departure_address: string;
  departure_latitude: number;
  departure_longitude: number;

  neighborhoodsServed: NeighborhoodServed[],
  destinations: Destination[]
}

class CreateItineraryService {
  public async execute({
    id_itinerary,
    vehicle_plate,
    price,
    days_of_week,
    specific_day,
    estimated_departure_time,
    estimated_arrival_time,
    available_seats,
    itinerary_nickname,
    is_active,
    neighborhoodsServed,
    destinations,
    estimated_departure_address,
    departure_latitude,
    departure_longitude,
  }: Request): Promise<Itinerary> {
    const itinerariesRepository = getRepository(Itinerary);

    // TODO, verificar se o período já está ocupado para a placa da vehicle informada!
    // const checkUserEmailExists = await usersRepository.findOne({
    //   where: { id_itinerary },
    // });

    // if (checkUserEmailExists) {
    //   throw new AppError('Email já cadastrado!', 200);
    // }

    const itinerary = itinerariesRepository.create({
      id_itinerary,
      vehicle_plate,
      price,
      days_of_week,
      specific_day,
      estimated_departure_time,
      estimated_arrival_time,
      available_seats,
      itinerary_nickname,
      is_active,
      estimated_departure_address,
      departure_latitude,
      departure_longitude,
    });

    await itinerariesRepository.save(itinerary);

    itinerary.neighborhoodsServed = neighborhoodsServed
    itinerary.destinations = destinations

    await itinerariesRepository.save(itinerary);

    return itinerary;
  }
}

export default CreateItineraryService;
