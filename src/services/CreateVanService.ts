import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import User from '../models/User';

import Van from '../models/Van';

interface Request {
  id_user: string;
  plate: string;
  brand: string;
  model: string;
  seats_number: string;
  locator_name: string;
  locator_address: string;
  locator_complement: string;
  locator_city: string;
  locator_state: string;
}

class CreateVanService {
  public async execute({
    id_user,
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
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { id_user },
    });

    if (!user) {
      throw new AppError(
        'O usuário informado não foi encontrado.',
        404,
      );
    }

    const vanExists = await vansRepository.findOne({
      where: { plate },
    });

    if (vanExists) {
      throw new AppError(
        'Uma van com a placa informada já foi cadastrada.',
        409,
      );
    }

    const van = vansRepository.create({
      user,
      plate,
      brand,
      model,
      seats_number,
      document_status: false,
      locator_name,
      locator_address,
      locator_complement,
      locator_city,
      locator_state,
    });

    await vansRepository.save(van);

    return van;
  }
}

export default CreateVanService;
