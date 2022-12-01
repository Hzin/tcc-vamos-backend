import { createQueryBuilder, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Trip from '../models/Trip';

class GetTripsTodaysAttendanceList {
  public async execute(
    id_trip: number,
  ): Promise<any> {
    let is_return = false;
    const tripsRepository = getRepository(Trip);

    const trip = await tripsRepository.findOne({
      where: { id_trip },
      relations: ['itinerary'],
    });

    if (!trip) {
      throw new AppError('Não foi possível encontrar a viagem informada.', 404);
    }

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

    const passengers = await createQueryBuilder("passengers", "p")
    .leftJoinAndSelect("p.attendance_lists", "at")//, "at.trip_id = :id_trip AND at.is_return = :is_return", { id_trip, is_return })
    .leftJoinAndSelect("p.user", "u")
    .where("p.itinerary_id = :id", { id: trip.itinerary_id })
    .getMany()

    return passengers;
  }
}

export default GetTripsTodaysAttendanceList;
