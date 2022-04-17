import { Router } from 'express';
import { getRepository } from 'typeorm';

import Item from '../models/Item';

import CreateItemService from '../services/CreateItemService';

const itemRouter = Router();

itemRouter.get('/', async (request, response) => {
  const itemsRepository = getRepository(Item);

  const items = await itemsRepository.find();

  return response.json({ data: items });
});


itemRouter.post('/', async (request, response) => {
  const { nome, tipo, asset, preco } = request.body;

  const createItemService = new CreateItemService();

  createItemService.execute({ nome, tipo, asset, preco });

  return response.json({ message: 'Item criado com sucesso !!!'});
});

// itemRouter.patch('/edit', ensureAuthenticated, async (request, response) => {
//   const { name, itemname, bio, email, birth_date } = request.body;

//   const updateitemService = new UpdateitemService();

//   await updateitemService.execute({
//     id_item: request.item.id_item,
//     name,
//     itemname,
//     bio,
//     email,
//     birth_date,
//   });

//   return response.json({ message: 'item info sucessfully updated.' });
// });

export default itemRouter;
