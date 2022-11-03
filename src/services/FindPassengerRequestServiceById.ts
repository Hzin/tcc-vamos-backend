import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import PassengerRequest from '../models/PassengerRequest';

class FindPassengerRequestServiceById {
  public async execute(id_passenger_request: number): Promise<PassengerRequest> {
    const passengerRequestRepository = getRepository(PassengerRequest);

    const passengerRequest = await passengerRequestRepository.findOne({
      where: { id_passenger_request },
    });

    if (!passengerRequest) {
      throw new AppError('Uma requisição com identificador informado não foi encontrada.')
    }

    return passengerRequest;
  }
}

export default FindPassengerRequestServiceById;
