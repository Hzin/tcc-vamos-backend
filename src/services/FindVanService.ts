import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Van from '../models/Van';

class FindVanService {
  public async execute(id_van: string): Promise<Van> {
    const vansRepository = getRepository(Van);

    const van = await vansRepository.findOne({
      where: { id_van }
    });

    if (!van) {
      throw new AppError('Van does not exist.');
    };

    return van;
  }
}

export default FindVanService;
