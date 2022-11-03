import { getRepository } from "typeorm";
import { passengerRequestStatusTypes } from "../constants/passengerRequestStatusTypes";
import AppError from "../errors/AppError";
import Passenger from "../models/Passenger";
import PassengerRequest from "../models/PassengerRequest";

import FindItineraryService from "./FindItineraryService";
import FindPassengerService from "./FindPassengerService";
import FindUserService from "./FindUserService";
import UpdatePassengerRequestService from "./UpdatePassengerRequestService";

interface Request {
  user_id: string;
  itinerary_id: number;
  address: string;
  latitude_address: number;
  longitude_address: number;
  is_single: boolean;

  // newStatus: passengerRequestStatusTypes
}

class CreatePassengerService {
  public async execute({ user_id, itinerary_id, address, latitude_address, longitude_address, is_single }: Request): Promise<Passenger> {
    const passengersRequestsRepository = getRepository(PassengerRequest);
    const passengersRepository = getRepository(Passenger);

    const findUserService = new FindUserService()
    const user = await findUserService.execute(user_id);

    const findItineraryService = new FindItineraryService()
    const itinerary = await findItineraryService.execute("" + itinerary_id);

    const findPassengerService = new FindPassengerService()
    const isPassengerAlreadyInItinerary = await findPassengerService.execute(user.id_user, "" + itinerary.id_itinerary);

    if (isPassengerAlreadyInItinerary) {
      throw new AppError('Este usuário já faz parte desse itinerário!', 202)
    }

    const passengerRequest = await passengersRequestsRepository.findOne({
      where: { itinerary, user, status: passengerRequestStatusTypes.pending },
    });

    if (!passengerRequest) {
      throw new AppError('Este usuário não tem uma solicitação de contrato para esse itinerário!')
    }

    const updatePassengerRequestService = new UpdatePassengerRequestService()
    await updatePassengerRequestService.execute({ id_passenger_request: passengerRequest.id_passenger_request, status: passengerRequestStatusTypes.accepted })

    const passenger = passengersRepository.create({
      user,
      itinerary,
      address,
      latitude_address,
      longitude_address,
      is_single
    });

    await passengersRepository.save(passenger);

    return passenger;
  }
}

export default CreatePassengerService;
