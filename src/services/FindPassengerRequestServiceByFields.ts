import { getRepository } from 'typeorm';
import { passengerRequestTypes } from '../constants/passengerRequestTypes';

import AppError from '../errors/AppError';

import PassengerRequest from '../models/PassengerRequest';

interface Request {
  id_itinerary: number;
  id_user: string;
}

class FindPassengerRequestServiceByFields {
  public async execute({ id_itinerary, id_user }: Request): Promise<PassengerRequest> {
    const passengerRequestRepository = getRepository(PassengerRequest)

    const passengerRequest = await passengerRequestRepository.findOne({
      where: { id_itinerary, id_user },
    });

    if (!passengerRequest) {
      throw new AppError('Não foi encontrado uma requisição de contrato do usuário no itinerário com status informado.')
    }

    return passengerRequest
  }
}

export default FindPassengerRequestServiceByFields;
