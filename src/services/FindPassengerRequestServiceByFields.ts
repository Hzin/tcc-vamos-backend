import { getRepository } from 'typeorm';
import { passengerRequestTypes } from '../constants/passengerRequestTypes';

import AppError from '../errors/AppError';

import PassengerRequest from '../models/PassengerRequest';

interface Request {
  id_itinerary: number;
  id_user: string;
  status?: passengerRequestTypes
}

class FindPassengerRequestServiceByFields {
  public async execute({ id_itinerary, id_user, status }: Request): Promise<PassengerRequest> {
    const passengerRequestRepository = getRepository(PassengerRequest)

    let passengerRequest: PassengerRequest | undefined

    if (status) passengerRequest = await passengerRequestRepository.findOne({ where: { id_itinerary, id_user, status } });
    else passengerRequest = await passengerRequestRepository.findOne({ where: { id_itinerary, id_user } });

    if (!passengerRequest) {
      throw new AppError('Não foi encontrado uma requisição de contrato do usuário no itinerário.')
    }

    return passengerRequest
  }
}

export default FindPassengerRequestServiceByFields;
