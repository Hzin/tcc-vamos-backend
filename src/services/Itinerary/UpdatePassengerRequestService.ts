import { getRepository } from "typeorm";

import { PassengerRequestStatus } from "../../enums/PassengerRequestStatus";

import PassengerRequest from "../../models/PassengerRequest";
import FindPassengerRequestServiceById from "./FindPassengerRequestServiceById";

import Utils from '../utils/Utils'
import AppError from "../../errors/AppError";
import Passenger from "../../models/Passenger";
import { PassengerStatus } from "../../enums/PassengerStatus";

interface Request {
  id_passenger_request: number;
  status: PassengerRequestStatus
}

interface Response {
  passengerRequestWithUpdatedStatus: PassengerRequest;
  message: string;
}

class UpdatePassengerRequestService {
  public async execute({ id_passenger_request, status }: Request): Promise<Response> {
    if (!Utils.stringIsInEnum(status, PassengerRequestStatus)) throw new AppError('O status informado é inválido')
    if (status === PassengerRequestStatus.pending) throw new AppError('O status informado é inválido para a atualização de pedido de passageiro.')

    const passengersRequestsRepository = getRepository(PassengerRequest);

    const findPassengerRequestServiceById = new FindPassengerRequestServiceById()
    let passengerRequest = await findPassengerRequestServiceById.execute(id_passenger_request);

    passengerRequest.status = status

    await passengersRequestsRepository.save(passengerRequest);

    if (status === PassengerRequestStatus.accepted) {
      const passengersRepository = getRepository(Passenger)
      const passenger = passengersRepository.create({
        itinerary_id: passengerRequest.itinerary_id,
        user_id: passengerRequest.user_id,
        contract_type: passengerRequest.contract_type,
        period: passengerRequest.period,
        status: PassengerStatus.ongoing,
        lat_origin: passengerRequest.lat_origin,
        lng_origin: passengerRequest.lng_origin,
        formatted_address_origin: passengerRequest.formatted_address_origin,
        lat_destination: passengerRequest.lat_destination,
        lng_destination: passengerRequest.lng_destination,
        formatted_address_destination: passengerRequest.formatted_address_destination,
        payment_status: true
      })

      await passengersRepository.save(passenger)

      return {
        passengerRequestWithUpdatedStatus: passengerRequest,
        message: 'Passageiro aceito com sucesso!'
      }
    }

    return {
      passengerRequestWithUpdatedStatus: passengerRequest,
      message: 'Passageiro recusado com sucesso.'
    }
  }
}

export default UpdatePassengerRequestService;
