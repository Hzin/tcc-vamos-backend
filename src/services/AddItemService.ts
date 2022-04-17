import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Inventario from '../models/Inventario';
import User from '../models/User';
import Item from '../models/Item';

interface Request {
  id_item: string;
  id_user: string;
}

class AddItemService {
  public async execute({
    id_item,
    id_user
  }: Request): Promise<Inventario> {
    const inventarioRepository = getRepository(Inventario);
    const usersRepository = getRepository(User);
    const itemsRepository = getRepository(Item);

    const user = await usersRepository.findOne({
      where: { id_user },
    });

    if (!user) {
      throw new AppError('User does not exist.');
    }

    const item = await itemsRepository.findOne({
      where: { id_item },
    });

    if (!item) {
      throw new AppError('User does not exist.');
    }

    const inventario = inventarioRepository.create({
      item, user
    });

    await inventarioRepository.save(inventario);

    return inventario;
  }
}

export default AddItemService;
