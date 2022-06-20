import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Van from '../models/Van';

interface Request {
  plate: string;
  brand: string;
  model: string;
  seats_number: string;
}

class UpdateVanService {
  public async execute({
    plate,
    brand,
    model,
    seats_number,
  }: Request): Promise<Van> {
    const vansRepository = getRepository(Van);

    const van = await vansRepository.findOne({
      where: { plate },
    });

    if (!van) {
      throw new AppError('Van informada não existe.');
    }

    if (plate) van.plate = plate;
    if (brand) van.brand = brand;
    if (model) van.model = model;
    if (seats_number) van.seats_number = (Number)(seats_number);

    await vansRepository.save(van);

    return van;
  }
}

export default UpdateVanService;
