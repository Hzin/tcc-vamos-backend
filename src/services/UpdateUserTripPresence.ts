import { getRepository } from "typeorm";
import { attendanceListStatus } from "../constants/attendanceListStatus";
import AppError from "../errors/AppError";
import AttendanceList from "../models/AttendanceList";
import Trip from "../models/Trip";
import User from "../models/User";
import Passenger from "../models/Passenger";

interface Request {
  id_user: string;
  id_trip: number;
  status: attendanceListStatus;
}

class UpdateUserTripPresenceService {
  public async execute({ id_user, id_trip, status }: Request): Promise<string> {
    let is_return = false;
    const attendanceListRepository = getRepository(AttendanceList);
    const userRepository = getRepository(User);
    const tripsRepository = getRepository(Trip);
    const passengersRepository = getRepository(Passenger);

    const trip = await tripsRepository.findOne({
      where: { id_trip },
      relations: ["itinerary"],
    });

    if (!trip) {
      throw new AppError('Não foi possível encontrar a viagem informada.', 404);
    }

    const user = await userRepository.findOne({
      where: { id_user },
    });

    const passenger = await passengersRepository.findOne({
      where: { user_id: id_user, itinerary_id: trip.itinerary_id },
    });

    //Verifica se a viagem já foi realizada
    const hour = trip.itinerary.estimated_arrival_time.split(':')[0] as unknown as number;
    const minute = trip.itinerary.estimated_arrival_time.split(':')[1] as unknown as number;
    const date = new Date();
    const tripDate = new Date(trip.date);
    const tripHour = new Date(
      tripDate.getFullYear(),
      tripDate.getMonth(),
      tripDate.getDate(),
      hour,
      minute,
    );

    if (date > tripHour) {
      is_return = true;
    }

    const attendanceList = await attendanceListRepository.findOne({
      where: {
        passenger,
        trip,
        is_return,
        date: new Date(),
      },
    });

    if (!attendanceList) {
      let attendance_list = attendanceListRepository.create({
        passenger,
        trip,
        is_return,
        date: new Date(),
        status: status,
      });

      attendance_list = await attendanceListRepository.save(attendance_list);
    } else {
      attendanceList.status = status;
      attendanceListRepository.save(attendanceList);
    }

    return "Presença atualizada com sucesso.";
  }
}

export default UpdateUserTripPresenceService;
