import { getRepository } from "typeorm";
import AppError from "../errors/AppError";
import Itinerary from "../models/Itinerary";
import Passenger from "../models/Passenger";
import PassengerRequest from "../models/PassengerRequest";
import User from "../models/User";

interface Request {
  user_id: string;
  itinerary_id: number;
  address: string;
  latitude_address: number;
  longitude_address: number;
  is_single: boolean;
}

async function CreatePassenger(req: Request): Promise<Passenger> {

  const usersRepository = getRepository(User);
  const itinerariesRepository = getRepository(Itinerary);
  const passengersRepository = getRepository(Passenger);
  const passengersRequestsRepository = getRepository(PassengerRequest);

  const user = await usersRepository.findOne({
    where: { id_user: req.user_id },
  });

  if (!user) {
    throw new AppError('Usuário inválido!', 404);
  }

  const itinerary = await itinerariesRepository.findOne({
    where: { id_itinerary: req.itinerary_id },
  });

  if (!itinerary) {
    throw new AppError('Itinerário não encontrado!', 404);
  }

  const passengers = await passengersRepository.findOne({
    where: { itinerary, user },
  });

  if (passengers) {
    throw new AppError('Este usuário já faz parte desse itinerário!', 202)
  }

  const passenger_request = await passengersRequestsRepository.findOne({
    where: { itinerary, user, status: 'pending' },
  });

  if (passenger_request) {
    passengersRequestsRepository.update(passenger_request, { status: 'accepted' });
  }

  const passenger = passengersRepository.create(req);
  await passengersRepository.save({
    ...req,
    itinerary,
    user,
    payment_status: true,
  });

  return passenger;
}

export default CreatePassenger;
