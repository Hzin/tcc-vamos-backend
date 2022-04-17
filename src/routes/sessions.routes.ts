import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

// login pode ser: email ou username
sessionsRouter.post('/', async (request, response) => {
  const { login, password } = request.body;

  const authenticateUserService = new AuthenticateUserService();

  const token = await authenticateUserService.execute({
    login,
    password,
  });

  return response.json({ message: 'User logged in sucessfully', token: token });
});

export default sessionsRouter;
