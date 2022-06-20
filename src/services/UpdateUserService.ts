import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import Social from '../models/SocialInformation';

interface Request {
  id_user: string;
  name: string;
  lastname: string;
  username: string;
  bio: string;
  email: string;
  birth_date: string;
  cpf: string;
  cnpj: string;
}

class UpdateUserService {
  public async execute({ id_user, name, lastname, username, bio, email, birth_date, cpf, cnpj }: Request): Promise<User> {
    const usersRepository = getRepository(User);
    const socialRepository = getRepository(Social);

    const user = await usersRepository.findOne({
      where: { id_user: id_user }
    });

    if (!user) {
      throw new AppError('User does not exist.');
    };

    if (name) user.name = name
    if (lastname) user.lastname = lastname
    if (bio) user.bio = bio
    if (email) user.email = email

    if (cpf) user.cpf = cpf
    if (cnpj) user.cnpj = cnpj
    
    // user.birth_date = new Date(birth_date); // TODO, funciona?

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserService;
