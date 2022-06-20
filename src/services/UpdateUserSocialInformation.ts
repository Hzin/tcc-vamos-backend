import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import Social from '../models/SocialInformation';

interface Request {
  id_user: string;
  social_info_request: {
    phone?: string;
    whatsapp?: string;
    facebook?: string;
    telegram?: string;
  };
  username: string;
}

class UpdateUserSocialService {
  public async execute({
    id_user,
    social_info_request,
    username,
  }: Request): Promise<Social> {
    const usersRepository = getRepository(User);
    const socialInformationRepository = getRepository(Social);

    const user = await usersRepository.findOne({
      where: { id_user },
    });

    if (!user) {
      throw new AppError('User does not exist.', 404);
    }

    let social = await socialInformationRepository.findOne({
      where: { user },
    });

    if (!social) {
      social = socialInformationRepository.create({ user, phone: "", whatsapp: "", facebook: "", telegram: "" });
    }

    if (social_info_request.phone) {
      social.phone = social_info_request.phone
    }

    if (social_info_request.whatsapp) {
      social.whatsapp = social_info_request.whatsapp
    }

    if (social_info_request.facebook) {
      social.facebook = social_info_request.facebook
    }
    
    if (social_info_request.telegram) {
      social.telegram = social_info_request.telegram
    }

    await socialInformationRepository.save(social);

    return social;
  }
}

export default UpdateUserSocialService;