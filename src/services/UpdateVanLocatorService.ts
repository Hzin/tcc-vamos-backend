import { getRepository } from 'typeorm';

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

class UpdateVanLocatorService {
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

    if (!van.locator) {
      throw new AppError(
        'A van informada não possui um locador cadastrado.',
        404,
      );
    }

    if (name) van.locator.name = name
    if (address) van.locator.address = address
    if (complement) van.locator.complement = complement
    if (city) van.locator.city = city
    if (state) van.locator.state = state

    await vansRepository.save(van);

    return van.locator;
  }
}

export default UpdateVanLocatorService;
