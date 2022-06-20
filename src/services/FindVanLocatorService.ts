import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Van from '../models/Van';
import VanLocator from '../models/VanLocator';

class FindVanLocatorService {
  public async execute(id_van: string): Promise<VanLocator> {
    const vansRepository = getRepository(Van);
    const vansLocatorsRepository = getRepository(VanLocator);

    const van = await vansRepository.findOne({
      where: { id_van }
    });

    if (!van) {
      throw new AppError('A Van informada não existe.', 404);
    };

    return van.locator;
  }
}

export default FindVanLocatorService;
