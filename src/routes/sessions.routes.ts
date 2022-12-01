import { Router } from 'express';
import { sign, verify } from 'jsonwebtoken';

import authConfig from '../config/auth';
import AppError from '../errors/AppError';

import AuthenticateUserService from '../services/Session/AuthenticateUserService';
import FindUserService from '../services/User/FindUserService';

const sessionsRouter = Router();

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

// login pode ser: email ou username
sessionsRouter.post('/', async (request, response) => {
  const { login, password } = request.body;

  const authenticateUserService = new AuthenticateUserService();

  const {token, user} = await authenticateUserService.execute({
    login,
    password,
  });

  return response.json({ message: 'Usuário autenticado com sucesso!', token: token, user: user });
});

sessionsRouter.post('/refresh', async(request, response) => {
  const { token } = request.body;

  let sub = null;
  let decoded = null;

  try {
    decoded = verify(token, authConfig.jwt.secret);
  } catch (error) {
    throw new AppError('Token de autenticação inválido.', 401);
  }

  sub = decoded as TokenPayload;

  // verificando se o usuário existe
  const findUserService = new FindUserService;
  await findUserService.execute(sub.sub)

  return response.json({ "status": "success", "userId": sub.sub });
})

export default sessionsRouter;
