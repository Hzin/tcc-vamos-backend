import { Router } from 'express';

import { getRepository } from 'typeorm';

import Follow from '../models/Follow';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import CreateFollowService from '../services/CreateFollowService';
import DeleteFollowService from '../services/DeleteFollowService';
import CheckUserIsFollowingUserService from '../services/CheckUserIsFollowingUserService';
import UpdateFollowCounterService from '../services/UpdateFollowCounterService';
import FindUserFollowersService from '../services/FindUserFollowersService';

const followsRouter = Router();

followsRouter.get('/list', ensureAuthenticated, async (request, response) => {
  const followsRepository = getRepository(Follow);

  const follows = await followsRepository.find();

  return response.json({ data: follows });
});

followsRouter.get('/get/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const findUserFollowersService = new FindUserFollowersService();

  const followers = await findUserFollowersService.execute(id);

  return response.json({ data: followers });
});

followsRouter.get(
  '/check/:id',
  ensureAuthenticated,
  async (request, response) => {
    const { id } = request.params;

    const checkUserIsFollowingUserService = new CheckUserIsFollowingUserService();

    const checkUserIsFollowing = await checkUserIsFollowingUserService.execute({
      id_user_following: request.user.id_user,
      id_user_followed: id,
    });

    return response.json({ data: checkUserIsFollowing });
  },
);

followsRouter.post('/add', ensureAuthenticated, async (request, response) => {
  const { id_user_followed } = request.body;

  const createFollowService = new CreateFollowService();

  // TODO, necessário?
  await createFollowService.execute({
    id_user_following: request.user.id_user,
    id_user_followed,
  });

  const updateFollowCounterService = new UpdateFollowCounterService();

  await updateFollowCounterService.execute({ id_user: id_user_followed });

  return response.json({ message: 'User followed succesfully. ' });
});

followsRouter.delete(
  '/remove/:id',
  ensureAuthenticated,
  async (request, response) => {
    const { id } = request.params;

    const deleteFollowService = new DeleteFollowService();

    await deleteFollowService.execute({
      id_user_following: request.user.id_user,
      id_user_followed: id,
    });

    const updateFollowCounterService = new UpdateFollowCounterService();

    await updateFollowCounterService.execute({ id_user: id });

    return response.json({ message: 'Unfollowed user.' });
  },
);

export default followsRouter;
