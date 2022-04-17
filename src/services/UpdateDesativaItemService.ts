import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import Inventario from '../models/Inventario';
import Item from '../models/Item';

interface Request {
  id_user: string;
  id_item: number;
}

class UpdateDesativaItemService {
  public async execute({ id_user, id_item }: Request): Promise<Inventario> {
    const usersRepository = getRepository(User);
    const inventarioRepository = getRepository(Inventario);
    const ItemRepository = getRepository(Item);

    const user = await usersRepository.findOne({
      where: { id_user: id_user }
    });

    if (!user) {
      throw new AppError('User does not exist.');
    };

    const item = await ItemRepository.findOne({
      where: { id_item: id_item}
    });

    if (!item) {
      throw new AppError('Item does not exist.');
    };

    const inventario = await inventarioRepository.findOne({
      where: { item: item, user: user}
    });

    if (!inventario) {
      throw new AppError('Inventario não contém esse item.');
    };

    inventario.ativo = false;

    await inventarioRepository.save(inventario);

    return inventario;
  }
}

export default UpdateDesativaItemService;
