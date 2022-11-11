import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import SocialInformation from '../models/SocialInformation';

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
  }: Request): Promise<SocialInformation> {
    const usersRepository = getRepository(User);
    const socialInformationRepository = getRepository(SocialInformation);

    const user = await usersRepository.findOne({
      where: { id_user },
    });

    if (!user) {
      throw new AppError('User does not exist.', 404);
    }

    let socialInformation = await socialInformationRepository.findOne({
      where: { user },
    });

    if (!socialInformation) {
      socialInformation = socialInformationRepository.create({ user, phone: "", whatsapp: "", facebook: "", telegram: "" });
    }

    if (social_info_request.phone) {
      socialInformation.phone = social_info_request.phone
    }

    if (social_info_request.whatsapp) {
      socialInformation.whatsapp = social_info_request.whatsapp
    }

    if (social_info_request.facebook) {
      socialInformation.facebook = social_info_request.facebook
    }

    if (social_info_request.telegram) {
      socialInformation.telegram = social_info_request.telegram
    }

    await socialInformationRepository.save(socialInformation);

    return socialInformation;
  }
}

export default UpdateUserSocialService;
