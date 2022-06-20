import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Van from '../models/Van';

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

class UpdateVanService {
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
  }: Request): Promise<Van> {
    const vansRepository = getRepository(Van);

    const van = await vansRepository.findOne({
      where: { plate },
    });

    if (!van) {
      throw new AppError('A van informada não existe.');
    }

    if (brand) van.brand = brand
    if (model) van.model = model
    if (seats_number) van.seats_number = seats_number
    if (locator_name) van.locator_name = locator_name
    if (locator_address) van.locator_address = locator_address
    if (locator_complement) van.locator_complement = locator_complement
    if (locator_city) van.locator_city = locator_city
    if (locator_state) van.locator_state = locator_state

    await vansRepository.save(van);

    return van;
  }
}

export default UpdateVanService;
