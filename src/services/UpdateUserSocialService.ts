import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import Social from '../models/SocialInformation';

interface Request {
  id_user: string;
  social_network: {
    phone: string;
    whatsapp: string;
    facebook: string;
    telegram: string;
  };
}

class UpdateUserSocialService {
  public async execute({ id_user, social_network }: Request): Promise<Social> {
    const usersRepository = getRepository(User);
    const socialInformationRepository = getRepository(Social);

    const user = await usersRepository.findOne({
      where: { id_user },
    });

    if (!user) {
      throw new AppError('User does not exist.');
    }

    let social = await socialInformationRepository.findOne({
      where: { user },
    });

    if (!social) {
      social = socialInformationRepository.create({
        user,
        phone: '',
        whatsapp: '',
        facebook: '',
        telegram: '',
      });
    }

    if (social_network.phone) social.phone = social_network.phone;
    if (social_network.whatsapp) social.whatsapp = social_network.whatsapp;
    if (social_network.facebook) social.facebook = social_network.facebook;
    if (social_network.telegram) social.telegram = social_network.telegram;

    await socialInformationRepository.save(social);

    return social;
  }
}

export default UpdateUserSocialService;
