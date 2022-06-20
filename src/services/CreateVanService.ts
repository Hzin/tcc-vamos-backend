import { getRepository } from 'typeorm';
import { v4 } from 'uuid';
import { hash } from 'bcryptjs';

import AppError from '../errors/AppError';

import Van from '../models/Van';

interface Request {
  plate: string;
  brand: string;
  model: string;
  seats_number: string;
}

class CreateVanService {
  public async execute({
    plate,
    brand,
    model,
    seats_number,
  }: Request): Promise<Van> {
    const vansRepository = getRepository(Van);

    const checkVanPlateExists = await vansRepository.findOne({
      where: { plate },
    });

    if (checkVanPlateExists) {
      throw new AppError('Placa do veículo já cadastrado!', 409);
    }

    const van = vansRepository.create({
      id_van: v4(),
      plate,
      brand,
      model,
      seats_number: (Number)(seats_number),
    });

    await vansRepository.save(van);

    return van;
  }
}

export default CreateVanService;
