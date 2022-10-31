import { getRepository } from "typeorm";
import AppError from "../errors/AppError";
import Itinerary from "../models/Itinerary";
import PassengerRequest from "../models/PassengerRequest";
import User from "../models/User";
import CreatePassenger from "./CreatePassenger";

interface Request {
  user_id: string;
  itinerary_id: number;
  address: string;
  latitude_address: number;
  longitude_address: number;
  is_single: boolean;
}

async function CreatePassengerRequest(req: Request): Promise<PassengerRequest> {
  const usersRepository = getRepository(User);
  const itinerariesRepository = getRepository(Itinerary);
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

  const passenger_request = await passengersRequestsRepository.findOne({
    where: { itinerary, user, status: 'pending' },
  });

  if (passenger_request) {
    throw new AppError('Pedido em análise!', 202)
  }


  const request = passengersRequestsRepository.create(req);
  await passengersRequestsRepository.save({
    ...req,
    itinerary,
    user,
    status: 'pending',
  });

  // Já insere na tabela de passageiros (REMOVER QUANDO A TELA DE ACEITE PELO MOTORISTA ESTIVER PRONTA)
  CreatePassenger(req)

  return request;
}

export default CreatePassengerRequest;
