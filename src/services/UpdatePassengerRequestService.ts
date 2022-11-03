import { getRepository } from "typeorm";

import { passengerRequestStatusTypes } from "../constants/passengerRequestStatusTypes";

import PassengerRequest from "../models/PassengerRequest";
import FindPassengerRequestServiceById from "./FindPassengerRequestServiceById";

import Utils from '../services/utils/Utils'
import AppError from "../errors/AppError";

interface Request {
  id_passenger_request: number;
  status: passengerRequestStatusTypes
}

class UpdatePassengerRequestService {
  public async execute({ id_passenger_request, status }: Request): Promise<PassengerRequest> {

    if (!Utils.stringIsInEnum(status, passengerRequestStatusTypes)) throw new AppError('O status informado é inválido')

    const passengersRequestsRepository = getRepository(PassengerRequest);

    const findPassengerRequestServiceById = new FindPassengerRequestServiceById()
    let passengerRequest = await findPassengerRequestServiceById.execute(id_passenger_request);

    passengerRequest.status = status

    await passengersRequestsRepository.save(passengerRequest);

    return passengerRequest;
  }
}

export default UpdatePassengerRequestService;
