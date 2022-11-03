import { getRepository } from 'typeorm';
import { passengerRequestStatusTypes } from '../constants/passengerRequestStatusTypes';

import AppError from '../errors/AppError';
import Itinerary from '../models/Itinerary';

import PassengerRequest from '../models/PassengerRequest';
import User from '../models/User';

interface Request {
  itinerary: Itinerary;
  user: User;
  status?: passengerRequestStatusTypes
}

class FindPassengerRequestServiceByFields {
  public async execute({ itinerary, user, status }: Request): Promise<PassengerRequest> {
    const passengerRequestRepository = getRepository(PassengerRequest)

    let passengerRequest: PassengerRequest | undefined

    if (status) passengerRequest = await passengerRequestRepository.findOne({ where: { itinerary, user, status } });
    else passengerRequest = await passengerRequestRepository.findOne({ where: { itinerary, user } });

    if (!passengerRequest) {
      throw new AppError('Não foi encontrado uma requisição de contrato do usuário no itinerário.')
    }

    return passengerRequest
  }
}

export default FindPassengerRequestServiceByFields;
