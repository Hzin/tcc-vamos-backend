import { Router } from 'express';
import { getRepository } from 'typeorm';

import Inventario from '../models/Inventario';

import AddItemService from '../services/AddItemService';
import FindInventarioUser from '../services/FindInventarioUserService';
import FindItensAtivosService from '../services/FindItensAtivosService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UpdateAtivaItemService from '../services/UpdateAtivaItemService';
import UpdateDesativaItemService from '../services/UpdateDesativaItemService';

const inventarioRouter = Router();

inventarioRouter.get('/', ensureAuthenticated, async (request, response) => {
  const inventarioRepository = getRepository(Inventario);

  const inventario = await inventarioRepository.find();

  return response.json({ data: inventario });
});

inventarioRouter.get('/find', ensureAuthenticated, async (request, response) => {
  const findInventarioUser = new FindInventarioUser;

  const inventario = await findInventarioUser.execute( request.user.id_user );

  return response.json({ data: inventario });
});

inventarioRouter.get('/findativos', ensureAuthenticated, async (request, response) => {
  const findItensAtivosService = new FindItensAtivosService;

  const inventario = await findItensAtivosService.execute( request.user.id_user );

  return response.json({ data: inventario });
});

inventarioRouter.post('/', ensureAuthenticated, async (request, response) => {
  const { id_item } = request.body;

  const addItem = new AddItemService();

  await addItem.execute({ id_item, id_user: request.user.id_user});

  return response.json({ message: 'Item adicionado com sucesso !' });
});

inventarioRouter.patch('/edit/ativa', ensureAuthenticated, async (request, response) => {
  const { id_item } = request.body;

  const updateInventarioService = new UpdateAtivaItemService();

  await updateInventarioService.execute({
    id_user: request.user.id_user,
    id_item
  });

  return response.json({ message: 'Item ativado com sucesso !' });
});

inventarioRouter.patch('/edit/desativa', ensureAuthenticated, async (request, response) => {
  const { id_item } = request.body;

  const updateDesativaItemService = new UpdateDesativaItemService();

  await updateDesativaItemService.execute({
    id_user: request.user.id_user,
    id_item
  });

  return response.json({ message: 'Item desativado com sucesso !' });
});

export default inventarioRouter;
