import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Vehicle from '../models/Vehicle';

interface Request {
  plate: string;
  brand?: string;
  model?: string;
  seats_number?: string;
  locator_name?: string;
  locator_address?: string;
  locator_complement?: string;
  locator_city?: string;
  locator_state?: string;
}

class UpdateVehicleService {
  public async execute({
    plate,
    brand,
    model,
    seats_number,
    locator_name,
    locator_address,
    locator_complement,
    locator_city,
    locator_state,
  }: Request): Promise<Vehicle> {
    const vehiclesRepository = getRepository(Vehicle);

    const vehicle = await vehiclesRepository.findOne({
      where: { plate },
    });

    if (!vehicle) {
      throw new AppError('A vehicle informada não existe.');
    }

    if (brand) vehicle.brand = brand
    if (model) vehicle.model = model
    if (seats_number) vehicle.seats_number = seats_number
    if (locator_name) vehicle.locator_name = locator_name
    if (locator_address) vehicle.locator_address = locator_address
    if (locator_complement) vehicle.locator_complement = locator_complement
    if (locator_city) vehicle.locator_city = locator_city
    if (locator_state) vehicle.locator_state = locator_state

    await vehiclesRepository.save(vehicle);

    return vehicle;
  }
}

export default UpdateVehicleService;
