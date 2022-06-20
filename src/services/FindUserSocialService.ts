import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import Social from '../models/SocialInformation';

class FindUserSocialService {
  public async execute(id_user: string): Promise<Social> {
    const usersRepository = getRepository(User);
    const socialInformationRepository = getRepository(Social);

    const user = await usersRepository.findOne({
      where: { id_user }
    });

    if (!user) {
      throw new AppError('User does not exist.');
    };

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
      
      await socialInformationRepository.save(social);
    };

    return social;
  }
}

export default FindUserSocialService;
