import { getRepository } from "typeorm";

import AppError from "../errors/AppError";

import { passengerRequestStatusTypes } from "../constants/passengerRequestStatusTypes";

import FindItineraryService from "./FindItineraryService";
import FindUserService from "./FindUserService";

import PassengerRequest from "../models/PassengerRequest";
import FindPassengerRequestServiceByFields from "./FindPassengerRequestServiceByFields";
import { itineraryContractTypes } from "../constants/itineraryContractTypes";

interface Request {
  id_user: string;
  id_itinerary: number;
  contract_type: itineraryContractTypes;
  lat_origin: number;
  lng_origin: number;
  formatted_address_origin: string;
  lat_destination: number;
  lng_destination: number;
  formatted_address_destination: string;
}


class CreatePassengerRequestService {
  public async execute({ id_user, id_itinerary, contract_type, lat_origin, lng_origin, formatted_address_origin, lat_destination, lng_destination, formatted_address_destination, }: Request): Promise<PassengerRequest> {
    const passengersRequestsRepository = getRepository(PassengerRequest);

    const findUserService = new FindUserService()
    const user = await findUserService.execute(id_user);

    const findItineraryService = new FindItineraryService()
    const itinerary = await findItineraryService.execute("" + id_itinerary);

    const findPassengerRequestServiceByFields = new FindPassengerRequestServiceByFields()

    let passengerHasPendingRequest: PassengerRequest | undefined
    try {
      passengerHasPendingRequest = await findPassengerRequestServiceByFields.execute({
        itinerary, user, status: passengerRequestStatusTypes.pending
      });
    } catch { }

    if (passengerHasPendingRequest) {
      throw new AppError('A solicitação de contrato está em análise.', 202)
    }

    const passengerRequest = passengersRequestsRepository.create({
      itinerary,
      user,
      contract_type,
      status: passengerRequestStatusTypes.pending,
      lat_origin,
      lng_origin,
      formatted_address_origin,
      lat_destination,
      lng_destination,
      formatted_address_destination,
    });

    await passengersRequestsRepository.save(passengerRequest);

    return passengerRequest;
  }
}

export default CreatePassengerRequestService;
