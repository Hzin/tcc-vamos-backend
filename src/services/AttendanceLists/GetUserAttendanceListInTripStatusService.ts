import { getRepository } from 'typeorm';
import { attendanceListStatus } from '../../constants/attendanceListStatus';
import AppError from '../../errors/AppError';
import AttendanceList from '../../models/AttendanceList';
import FindItineraryService from '../Itinerary/FindItineraryService';
import FindTripService from '../Trip/FindTripService';
import FindUserService from '../User/FindUserService';

interface Request {
  id_trip: string,
  id_user: string
}

class GetUserAttendanceListInTripStatusService {
  public async execute({ id_trip, id_user }: Request): Promise<attendanceListStatus> {
    const attendanceListsRepository = getRepository(AttendanceList)

    const findTripService = new FindTripService()
    const trip = await findTripService.execute(id_trip)

    const findItineraryService = new FindItineraryService()
    const itinerary = await findItineraryService.execute(trip.itinerary_id)

    const findUserService = new FindUserService()
    const user = await findUserService.execute(id_user)

    const passenger = itinerary.passengers.find((passenger) => {
      return passenger.user_id === user.id_user
    })

    const attendanceList = await attendanceListsRepository.findOne({
      where: { trip, passenger }
    })

    if (!attendanceList) throw new AppError("Não foi encontrado o passageiro informado na viagem informada.")

    return attendanceList.status
  }
}

export default GetUserAttendanceListInTripStatusService;
