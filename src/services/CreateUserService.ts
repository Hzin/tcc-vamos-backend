import { getRepository } from 'typeorm';
import { v4 } from 'uuid';
import { hash } from 'bcryptjs';

import AppError from '../errors/AppError';

import User from '../models/User';
import Social from '../models/Social';

interface Request {
  name: string;
  email: string;
  birth_date: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, birth_date, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);
    const socialsRepository = getRepository(Social);

    const checkUserEmailExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserEmailExists) {
      throw new AppError('Email já cadastrado!', 200);
    }

    const hashedPassword = await hash(password, 8);

    // TODO, arrumar regras de negócio para avatar_image e background_image
    // TODO, arrumar o formato das datas e padronizar com a equipe

    const user = usersRepository.create({
      id_user: v4(), name, email, birth_date, password: hashedPassword, avatar_image: "", bio: ""
    });
    await usersRepository.save(user);

    // já criar registro na tabela Socials para evitar inconsistências
    // const social = socialsRepository.create({ user, telegram: "", facebook: "", twitter: "", twitch: "" });
    // await socialsRepository.save(social);

    return user;
  }
}

export default CreateUserService;
