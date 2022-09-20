import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import User from '../models/User';
import Trip from '../models/Trip';
import Itinerary from '../models/Itinerary';
import Vehicle from '../models/Vehicle';
import FindVehiclesByUserIdService from './FindVehiclesByUserIdService';
import FindUserSocialService from './FindUserSocialService';

interface Request {
  id_user: string;
}

class GetUserTodaysTrips {
  public async execute(id_user: string): Promise<Trip[]> {
    const findUserService = new FindUserSocialService();
    const user = await findUserService.execute(id_user);

    const findVehiclesByUserIdService = new FindVehiclesByUserIdService();
    const vehicles = await findVehiclesByUserIdService.execute(id_user);

    let userItineraries: Itinerary[]

    vehicles.forEach(vehicle => {
      if (vehicle.itineraries) userItineraries.push(...vehicle.itineraries)
    })

    // TODO, continuar
  }
}

export default GetUserTodaysTrips;
