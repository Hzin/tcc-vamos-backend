import { Router } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ensureAdmin from '../middlewares/ensureAdmin';

import CreateUserService from '../services/User/CreateUserService';
import FindUserService from '../services/User/FindUserService';
import FindUserSocialService from '../services/User/FindUserSocialService';
import UpdateUserSocialService from '../services/User/UpdateUserSocialService';
import UpdateUserService from '../services/User/UpdateUserService';
import UpdateUserAvatarService from '../services/User/UpdateUserAvatarService';
// import UpdateUserPasswordService from '../services/User/UpdateUserPasswordService';
import CheckIfUserHasVehiclesService from '../services/User/CheckIfUserHasVehiclesService';

import AuthenticateUserService from '../services/Session/AuthenticateUserService';

const usersRouter = Router();

interface userWithoutSensitiveInfo {
  id_user: string;
  name: string;
  email: string;
  avatar_image: string;
}

usersRouter.get('/admin/check', ensureAdmin, async (request, response) => {
  return response.json({ data: true });
});

usersRouter.get('/list', ensureAdmin, async (request, response) => {
  const usersRepository = getRepository(User);

  const users = await usersRepository.find();

  let usersWithoutSensitiveInfo: userWithoutSensitiveInfo[] = [];

  // users.map(user => {
  //   usersWithoutSensitiveInfo.push({
  //     id_user: user.id_user,
  //     name: user.name,
  //     email: user.email,
  //     avatar_image: user.avatar_image,
  //   });
  // });

  return response.json({ data: users });
});

usersRouter.get('/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const findUserService = new FindUserService();

  const user = await findUserService.execute(id);

  // // converting ISO 8601 date to normal date
  // let birth_date = new Date(user.birth_date);

  // let year = birth_date.getFullYear();
  // let month = birth_date.getMonth() + 1;
  // let date = birth_date.getDate();

  // const newBirthDate = `${date}/${month}/${year}`;

  const userWithoutPassword = {
    id_user: user.id_user,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    phone_number: user.phone_number,
    birth_date: user.birth_date,
    avatar_image: user.avatar_image,
    bio: user.bio,
    document_type: user.document_type,
    document: user.document,
    // created_at: user.created_at,
    // updated_at: user.updated_at,
  };

  return response.json({ data: userWithoutPassword });
});

usersRouter.post('/', async (request, response) => {
  const { name, lastname, email, birth_date, password } = request.body;

  const createUserService = new CreateUserService();

  const user = await createUserService.execute({
    name,
    lastname,
    email,
    birth_date,
    password,
  });

  const authenticateUser = new AuthenticateUserService();

  const token = await authenticateUser.execute({
    login: user.email,
    password: password,
  });

  return response.json({ message: 'User successfully created.', token: token });
});

usersRouter.patch('/edit', ensureAuthenticated, async (request, response) => {
  const {
    name,
    lastname,
    bio,
    email,
    phone_number,
    birth_date,
    document_type,
    document,
  } = request.body;

  const updateUserService = new UpdateUserService();

  await updateUserService.execute({
    id_user: request.user.id_user,
    name,
    lastname,
    bio,
    email,
    phone_number,
    birth_date,
    document_type,
    document,
  });

  return response.json({ message: 'Perfil atualizado com sucesso.' });
});

usersRouter.get(
  '/isDriver/:id_user',
  ensureAuthenticated,
  async (request, response) => {
    const { id_user } = request.params;

    const checkIfUserHasVehiclesService = new CheckIfUserHasVehiclesService();

    const userHasVehicles = await checkIfUserHasVehiclesService.execute({
      id_user,
    });

    return response.json({ result: userHasVehicles });
  },
);

usersRouter.patch(
  '/edit/avatar',
  ensureAuthenticated,
  async (request, response) => {
    const { avatar_image } = request.body;

    const updateUserAvatarService = new UpdateUserAvatarService();

    await updateUserAvatarService.execute({
      id_user: request.user.id_user,
      avatar_image,
    });

    return response.json({ message: 'Avatar atualizado com sucesso !' });
  },
);

usersRouter.get(
  '/social/:id',
  ensureAuthenticated,
  async (request, response) => {
    const { id } = request.params;

    const findUserSocialService = new FindUserSocialService();

    const social = await findUserSocialService.execute(id);

    return response.json({ data: social });
  },
);

usersRouter.patch(
  '/edit/social',
  ensureAuthenticated,
  async (request, response) => {
    const { social_network, username } = request.body;

    const updateUserSocialService = new UpdateUserSocialService();

    await updateUserSocialService.execute({
      id_user: request.user.id_user,
      social_network,
    });

    return response.json({ message: 'Social info sucessfully updated.' });
  },
);

// usersRouter.patch(
//   '/edit/password',
//   ensureAuthenticated,
//   async (request, response) => {
//     const { password_old, password_new } = request.body;

//     const updateUserPasswordService = new UpdateUserPasswordService();

//     await updateUserPasswordService.execute({
//       id_user: request.user.id_user,
//       password_old: password_old,
//       password_new: password_new,
//     });

//     return response.json({ message: 'Password sucessfully updated.' });
//   },
// );

usersRouter.get(
  '/social/:id_user',
  ensureAuthenticated,
  async (request, response) => {
    const { id_user } = request.params;

    const findUserSocialService = new FindUserSocialService();

    const social = await findUserSocialService.execute(id_user);

    return response.json({ data: social });
  },
);

usersRouter.patch('/social', ensureAuthenticated, async (request, response) => {
  const { id_user, phone, whatsapp, facebook, telegram } = request.body;

  const social_network = {
    phone,
    whatsapp,
    facebook,
    telegram,
  };

  const updateUserSocialService = new UpdateUserSocialService();
  const social = await updateUserSocialService.execute({
    id_user,
    social_network,
  });

  return response.json({ data: social });
});

export default usersRouter;
