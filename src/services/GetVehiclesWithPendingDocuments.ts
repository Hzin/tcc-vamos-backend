import {  getRepository } from 'typeorm';
import Vehicle from '../models/Vehicle';

class GetVehiclesWithPendingDocuments {
  public async execute(): Promise<Vehicle[]> {
    const vehiclesRepository = getRepository(Vehicle)

    const vehicles = await vehiclesRepository.find()
    const filteredVehicles = vehicles.filter((vehicle) => {
      if (!vehicle.documents || vehicle.documents.length === 0) return false
      return true
    })

    return filteredVehicles
  }
}

export default GetVehiclesWithPendingDocuments;
