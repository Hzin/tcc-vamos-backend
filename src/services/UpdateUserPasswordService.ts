import { getRepository } from 'typeorm';
import { hash, compare } from 'bcryptjs';

import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
  id_user: string;
  password_old: string;
  password_new: string;
}

class UpdateUserService {
  public async execute({ id_user, password_old, password_new }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { id_user: id_user }
    });

    // TODO, notar que isso é necessário
    // tentar remover que o TypeScript apontará como erro
    if (!user) {
      throw new AppError('User does not exist.');
    };

    // TODO, padronizar mensagens em PT-BR
    const passwordMatched = await compare(password_old, user.password);

    if (!passwordMatched) throw new AppError("Senha atual incorreta.", 200);

    const hashedNewPassword = await hash(password_new, 8);

    user.password = hashedNewPassword;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserService;
