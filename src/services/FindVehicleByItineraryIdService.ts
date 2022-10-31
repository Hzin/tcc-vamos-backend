import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';


import Vehicle from '../models/Vehicle';
import FindItineraryService from './FindItineraryService';

class FindVehicleByItineraryId {
  public async execute(id_itinerary: string): Promise<Vehicle> {
    const vehiclesRepository = getRepository(Vehicle);

    // verifica se o itinerário existe
    const findItineraryService = new FindItineraryService()
    await findItineraryService.execute(id_itinerary)

    const vehicles = await vehiclesRepository.find()
    let flagFoundVehicle: Vehicle | undefined

    for (let i = 0; i < vehicles.length; i++) {
      const vehicle = vehicles[i]

      if (!vehicle.itineraries) continue

      for (let j = 0; j < vehicle.itineraries.length; j++) {
        const itinerary = vehicle.itineraries[j];

        if ("" + itinerary.id_itinerary === id_itinerary) {
          flagFoundVehicle = vehicle
          break
        }
      }
    }

    if (!flagFoundVehicle) throw new AppError("O itinerário informado não está associado a nenhum veículo.")

    return flagFoundVehicle
  }
}

export default FindVehicleByItineraryId;
