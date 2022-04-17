import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Item from '../models/Item';

interface Request {
  nome: string;
  tipo: string;
  asset: string;
  preco: number;
}

class CreateItemService {
  public async execute({
    nome,
    tipo,
    asset,
    preco
  }: Request): Promise<Item> {
    const itemsRepository = getRepository(Item);

    const item = itemsRepository.create({
      nome,
      tipo,
      asset,
      preco
    });

    await itemsRepository.save(item);

    return item;
  }
}

export default CreateItemService;
