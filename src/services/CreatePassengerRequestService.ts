import { getRepository } from "typeorm";

import AppError from "../errors/AppError";

import { passengerRequestStatusTypes } from "../constants/passengerRequestStatusTypes";

import FindItineraryService from "./FindItineraryService";
import FindUserService from "./FindUserService";

import PassengerRequest from "../models/PassengerRequest";
import FindPassengerRequestServiceByFields from "./FindPassengerRequestServiceByFields";

interface Request {
  id_user: string;
  id_itinerary: number;
  address: string;
  latitude_address: number;
  longitude_address: number;
  is_single: boolean;
}

class CreatePassengerRequestService {
  public async execute({ id_user, id_itinerary, address, latitude_address, longitude_address, is_single }: Request): Promise<PassengerRequest> {
    const passengersRequestsRepository = getRepository(PassengerRequest);

    const findUserService = new FindUserService()
    const user = await findUserService.execute(id_user);

    const findItineraryService = new FindItineraryService()
    const itinerary = await findItineraryService.execute("" + id_itinerary);

    const findPassengerRequestServiceByFields = new FindPassengerRequestServiceByFields()
    const passengerHasPendingRequest = await findPassengerRequestServiceByFields.execute({
      id_itinerary: itinerary.id_itinerary, id_user: user.id_user, status: passengerRequestStatusTypes.pending
    });

    if (passengerHasPendingRequest) {
      throw new AppError('A solicitação de contrato está em análise.', 202)
    }

    const passengerRequest = passengersRequestsRepository.create({
      itinerary,
      user,
      address,
      latitude_address,
      longitude_address,
      is_single,
      status: passengerRequestStatusTypes.pending,
    });

    await passengersRequestsRepository.save(passengerRequest);

    return passengerRequest;
  }
}

export default CreatePassengerRequestService;
