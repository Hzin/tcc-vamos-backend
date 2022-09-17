import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Itinerary from '../models/Itinerary';

import Vehicle from '../models/Vehicle';

class FindVehicleItineraries {
  public async execute(id_vehicle: string): Promise<VehicleLocator> {
    const vehiclesRepository = getRepository(Vehicle);
    const itinerariesRepository = getRepository(Itinerary);

    const vehicle = await vehiclesRepository.findOne({
      where: { id_vehicle }
    });

    if (!vehicle) {
      throw new AppError('A Vehicle informada não existe.', 404);
    };

    vehicle.itineraries

    let vehicleItineraries: Itinerary[]



    return ;
  }
}

export default FindVehicleItineraries;
