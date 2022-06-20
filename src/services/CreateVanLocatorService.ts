import { getRepository } from 'typeorm';
import { v4 } from 'uuid';
import { hash } from 'bcryptjs';

import AppError from '../errors/AppError';

import Van from '../models/Van';
import VanLocator from '../models/VanLocator';

interface Request {
  id_van: string;
  name: string;
  address: string;
  complement: string;
  city: string;
  state: string;
}

class CreateVanLocatorService {
  public async execute({
    id_van,
    name,
    address,
    complement,
    city,
    state,
  }: Request): Promise<VanLocator> {
    const vansRepository = getRepository(Van);
    const vansLocatorsRepository = getRepository(VanLocator);

    const van = await vansRepository.findOne({
      where: { id_van },
    });

    if (!van) {
      throw new AppError('A van informada não existe.', 404);
    }

    if (van.locator) {
      throw new AppError(
        'A van informada já possui um locador cadastrado.',
        400,
      );
    }

    const vanLocator = vansLocatorsRepository.create({
      name,
      address,
      complement,
      city,
      state,
    });

    await vansLocatorsRepository.save(vanLocator);

    // linka o locador para o registro da van
    van.locator = vanLocator
    await vansRepository.save(van);

    return vanLocator;
  }
}

export default CreateVanLocatorService;
