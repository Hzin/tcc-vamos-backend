import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import Social from '../models/SocialInformation';

interface Request {
  id_user: string;
  name: string;
  lastname: string;
  bio: string;
  email: string;
  phone_number: string;
  birth_date: string;
  document_type: string;
  document: string;
}

class UpdateUserService {
  public async execute({ id_user, name, lastname,  bio, email, phone_number, birth_date, document_type, document }: Request): Promise<User> {
    const usersRepository = getRepository(User);
    const socialRepository = getRepository(Social);

    const user = await usersRepository.findOne({
      where: { id_user }
    });

    if (!user) {
      throw new AppError('O usuário informado não existe.', 404);
    };

    if (name) user.name = name
    if (lastname) user.lastname = lastname
    if (bio) user.bio = bio
    if (email) user.email = email

    if (phone_number) {
      const phoneAlreadyExists = await usersRepository.findOne({
        where: { phone_number }
      });

      if (phoneAlreadyExists) {
        throw new AppError('O telefone informado já está em uso por outra conta!', 409);
      }
    }
    
    user.phone_number = phone_number

    if (document_type) user.document_type = document_type
    if (document) user.document = document
    
    // user.birth_date = new Date(birth_date); // TODO, funciona?

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserService;
