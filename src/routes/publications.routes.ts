import { Router } from 'express';
import { getRepository } from 'typeorm';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import Publication from '../models/Publication';
import CreatePublicationService from '../services/CreatePublicationService';
import FindTournamentsPublicatedService from '../services/FindTournamentsPublicatedService';

const pubsRouter = Router();

pubsRouter.get('/', async (request, response) => {
  const publicationsRepository = getRepository(Publication);

  const publications = await publicationsRepository.find();

  return response.json({ data: publications });
});

pubsRouter.post('/', ensureAuthenticated, async (request, response) => {
  const { id_tournament } = request.body;

  const createPublicationService = new CreatePublicationService();

  createPublicationService.execute({ id_user: request.user.id_user, id_tournament });

  return response.json({ message: "Publicação criada com sucesso !!!" })
});

pubsRouter.get('/find', ensureAuthenticated, async (request, response) => {

  const findPublicationService = new FindTournamentsPublicatedService();

  const publications = await findPublicationService.execute( request.user.id_user );

  return response.json({ data: publications });
});

export default pubsRouter;
