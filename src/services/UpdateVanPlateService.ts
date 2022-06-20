import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Van from '../models/Van';

interface Request {
  oldPlate: string;
  newPlate: string;
}

class UpdateVanPlateService {
  public async execute({ oldPlate, newPlate }: Request): Promise<Van> {
    const vansRepository = getRepository(Van);

    const van = await vansRepository.findOne({
      where: { plate: oldPlate },
    });

    if (!van) {
      throw new AppError('A van informada não existe.');
    }

    van.plate = newPlate

    await vansRepository.save(van);

    return van;
  }
}

export default UpdateVanPlateService;
