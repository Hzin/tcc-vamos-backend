import { Router } from 'express';
import GetUserAttendanceListInTripStatusService from '../services/AttendanceLists/GetUserAttendanceListInTripStatusService';

const attendanceListsRouter = Router();

attendanceListsRouter.get(
  '/trip/:id_trip/user/:id_user/status',
  async (request, response) => {
    const { id_trip, id_user } = request.params

    const getUserAttendanceListInTripStatus = new GetUserAttendanceListInTripStatusService()
    const status = await getUserAttendanceListInTripStatus.execute({ id_trip, id_user })

    return response.json({ data: status })
  },
);

export default attendanceListsRouter;
