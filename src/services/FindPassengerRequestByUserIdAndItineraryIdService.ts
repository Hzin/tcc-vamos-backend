import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import PassengerRequest from '../models/PassengerRequest';
import FindItineraryService from './FindItineraryService';
import FindUserService from './FindUserService';

interface Request {
  id_user: string;
  id_itinerary: string;
}

class FindPassengerRequestByUserIdAndItineraryIdService {
  public async execute({ id_user, id_itinerary }: Request): Promise<PassengerRequest> {
    const passengerRequestRepository = getRepository(PassengerRequest)

    const findUserService = new FindUserService()
    const user = await findUserService.execute(id_user)

    const findItineraryService = new FindItineraryService()
    const itinerary = await findItineraryService.execute(id_itinerary)

    const passengerRequest = await passengerRequestRepository.findOne({ where: { user, itinerary } })

    if (!passengerRequest) throw new AppError('Não foi encontrado uma requisição de passageiro com o usuário e o itinerário informados.')

    return passengerRequest
  }
}

export default FindPassengerRequestByUserIdAndItineraryIdService;
