import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Van from '../models/Van';

class FindVanService {
  public async execute(plate: string): Promise<Van> {
    const vansRepository = getRepository(Van);

    const van = await vansRepository.findOne({
      where: { plate }
    });

    if (!van) {
      throw new AppError('A van informada não existe.');
    };

    return van;
  }
}

export default FindVanService;
