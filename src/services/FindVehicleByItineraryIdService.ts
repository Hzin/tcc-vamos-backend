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

    vehicles.every((vehicle) => {
      if (!vehicle.itineraries) return

      vehicle.itineraries.every((itinerary) => {
        if ("" + itinerary.id_itinerary === id_itinerary) {
          flagFoundVehicle = vehicle
          return false
        }

        return true
      })

      if (!!flagFoundVehicle) {
        return false
      }
    })

    if (!flagFoundVehicle) throw new AppError("O itinerário informado não está associado a nenhum veículo.")

    return flagFoundVehicle
  }
}

export default FindVehicleByItineraryId;
