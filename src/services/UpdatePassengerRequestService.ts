import { getRepository } from "typeorm";

import { passengerRequestTypes } from "../constants/passengerRequestTypes";

import PassengerRequest from "../models/PassengerRequest";
import FindPassengerRequestServiceById from "./FindPassengerRequestServiceById";

interface Request {
  id_passenger_request: number;
  status: passengerRequestTypes
}

class UpdatePassengerRequestService {
  public async execute({ id_passenger_request, status }: Request): Promise<PassengerRequest> {
  const passengersRequestsRepository = getRepository(PassengerRequest);

  const findPassengerRequestServiceById = new FindPassengerRequestServiceById()
  let passengerRequest = await findPassengerRequestServiceById.execute(id_passenger_request);

  passengerRequest.status = status

  await passengersRequestsRepository.save(passengerRequest);

  return passengerRequest;
}
}

export default UpdatePassengerRequestService;
