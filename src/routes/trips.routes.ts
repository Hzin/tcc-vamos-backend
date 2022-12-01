import { Router } from 'express';
import { getRepository } from 'typeorm';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import Trip from '../models/Trip';

import CheckIfUserHasVehiclesService from '../services/User/CheckIfUserHasVehiclesService';
import FindTripService from '../services/Trip/FindTripService';
import CreateTripService from '../services/Trip/CreateTripService';
import UpdateTripStatusService from '../services/Trip/UpdateTripStatusService';
import UpdateTripNicknameService from '../services/Trip/UpdateTripNicknameService';
import GetUserTripsFeedService from '../services/Trip/GetUserTripsFeedService';
import FindTodaysTripByItineraryIdService from '../services/Trip/FindTodaysTripByItineraryIdService';
import FindItineraryTrips from '../services/Trip/FindItineraryTrips';
import AddOptionalPropertiesToItineraryObjectService from '../services/Utils/AddOptionalPropertiesToObjectService';
import UndoLastStatusChangeService from '../services/Trip/UndoLastStatusChangeService';
import FindTripHistoricService from '../services/Trip/FindTripHistoricService';
import GetTripsTodaysAttendanceList from '../services/GetTripsTodaysAttendanceList';
import UpdateUserTripPresenceService from '../services/UpdateUserTripPresence';

const tripsRouter = Router();

tripsRouter.get('/list', async (request, response) => {
  const tripsRepository = getRepository(Trip);

  let trips = await tripsRepository.find();

  const addOptionalPropertiesToObjectService =
    new AddOptionalPropertiesToItineraryObjectService();
  trips = await addOptionalPropertiesToObjectService.executeArrTrip(trips);

  return response.json({ data: trips });
});

tripsRouter.get('/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const findTripService = new FindTripService();
  let trip = await findTripService.execute(id);

  const addOptionalPropertiesToObjectService =
    new AddOptionalPropertiesToItineraryObjectService();
  trip = await addOptionalPropertiesToObjectService.executeSingleTrip(trip);

  return response.json({ data: trip });
});

tripsRouter.get(
  '/itinerary/:id',
  ensureAuthenticated,
  async (request, response) => {
    const { id } = request.params;

    const findItineraryTrips = new FindItineraryTrips();
    let trips = await findItineraryTrips.execute(id);

    const addOptionalPropertiesToObjectService =
      new AddOptionalPropertiesToItineraryObjectService();
    trips = await addOptionalPropertiesToObjectService.executeArrTrip(trips);

    return response.json({ data: trips });
  },
);

tripsRouter.get('/itinerary/:id/today/going', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const findTodaysTripByItineraryIdService = new FindTodaysTripByItineraryIdService();
  let trip = await findTodaysTripByItineraryIdService.execute({
    id_itinerary: id,
    tripType: 'going'
  })

    const addOptionalPropertiesToObjectService =
      new AddOptionalPropertiesToItineraryObjectService();
    trip = await addOptionalPropertiesToObjectService.executeSingleTrip(trip);

    return response.json({ data: trip });
  },
);

// tripType: 'going' | 'return'
// newStatus: 'confirm' | 'cancel'
tripsRouter.post('/tripType/:tripType/update/status/:newStatus', async (request, response) => {
  const { tripType, newStatus } = request.params;
  const { id_itinerary } = request.body;

  const createTripService = new CreateTripService();

  const { trip, message } = await createTripService.execute({
    id_itinerary,
    tripType,
    newTripStatus: newStatus
  });

  return response.json({ message: message, data: trip });
});


tripsRouter.patch('/:id/nickname', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;
  const { nickname } = request.body;

    const updateTripNicknameService = new UpdateTripNicknameService();

  await updateTripNicknameService.execute({
    id_trip: id, nickname
  });

    return response.json({
      message: 'Apelido da viagem atualizado com sucesso!',
    });
  },
);

tripsRouter.patch('/:id/status/new/:new_status', ensureAuthenticated, async (request, response) => {
  const { id, new_status } = request.params;
  const { description } = request.body;

  const updateTripStatusService = new UpdateTripStatusService();
  await updateTripStatusService.execute({
    id_trip: id, new_status, description
  });

    return response.json({
      message: 'Status da viagem atualizado com sucesso!',
    });
  },
);

tripsRouter.patch('/:id/status/undo', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const undoLastStatusChangeService = new UndoLastStatusChangeService();
  const tripHistory = await undoLastStatusChangeService.execute({ id_trip: id });

  return response.json({ message: 'Status da viagem atualizado com sucesso!', data: tripHistory });
});

tripsRouter.get('/:id/status/history', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const findTripHistoricService = new FindTripHistoricService();
  const tripHistory = await findTripHistoricService.execute({ id_trip: id });

  return response.json({ data: tripHistory });
});

tripsRouter.patch('/:id/status/undo', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const undoLastStatusChangeService = new UndoLastStatusChangeService();
  const tripHistory = await undoLastStatusChangeService.execute({ id_trip: id });

  return response.json({ message: 'Status da viagem atualizado com sucesso!', data: tripHistory });
});

tripsRouter.get('/:id/status/history', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const findTripHistoricService = new FindTripHistoricService();
  const tripHistory = await findTripHistoricService.execute({ id_trip: id });

  return response.json({ data: tripHistory });
});

// TODO, incluir filtros dependendo de status
// TODO, onde está sendo usado???
tripsRouter.get(
  '/user/:id',
  ensureAuthenticated,
  async (request, response) => {
    const { id } = request.params;
tripsRouter.get('/user/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const checkIfUserHasVehiclesService = new CheckIfUserHasVehiclesService();

  const userHasVehicles = await checkIfUserHasVehiclesService.execute({
    id_user: id,
  });

  return response.json({ result: userHasVehicles });
});

// get trip info about an itinerary
// should ask the driver if they want to confirm or cancel the trip for the day
// you can confirm the trip if trip's status is 'pending'
// you can cancel the trip if trip's status is 'pending' or 'confirmed'
// if a trip is confirmed, then a trip registry for the itinerary for the day should be created and its status updated
// if a trip is canceled, then a existing trip registry for the itinerary for the day should have its status updated

// how to inform front that the user can do certain actions?
// knowing the trip's status, the front can show specific buttons that will trigger the route that update the its status
// and the trip card can always show the trip status. It will be delivered by this route
// valid statuses: 'pending', 'confirmed'
// TODO, será usado?
// tripsRouter.get(
//   '/tripDay/:tripDay/status/itinerary/:id_itinerary',
//   ensureAuthenticated,
//   async (request, response) => {
//     const { tripDay, id_itinerary } = request.params;

//     TODO, service está incompleto
//     const findTodaysTripByItineraryIdService =
      // new FindTodaysTripByItineraryIdService();
//     const tripStatus = await findTodaysTripByItineraryIdService.execute(
    //   { id_itinerary,
    // , tripDay });

//     return response.json({ data: tripStatus });
//   },
// );

// feed sempre será sobre itinerários em que o usuário está participando
// então não necessariamente terá a ver com uma trip já criada
tripsRouter.get(
  '/feed/tripDay/:tripDay/userType/:userType',
  ensureAuthenticated,
  async (request, response) => {
    const { tripDay, userType } = request.params

    const getUserTripsFeedService = new GetUserTripsFeedService();
    const userTripsFeed = await getUserTripsFeedService.execute({
      id_user: request.user.id_user,
      tripDay,
      userType,
    });

    return response.json({ data: userTripsFeed });
  },
);

    const getUserTripsFeedService = new GetUserTripsFeedService();
    const userTripsFeed = await getUserTripsFeedService.execute({
      id_user: request.user.id_user,
      tripsType: 'not_today',
      userType: 'driver',
    });

    return response.json({ data: userTripsFeed });
  },
);

tripsRouter.get(
  '/:id_trip/attendance-list',
  ensureAuthenticated,
  async (request, response) => {
    const { id_trip } = request.params;
    //convert to number
    const id_trip_number = Number(id_trip);

    const getTripsTodaysAttendanceListService = new GetTripsTodaysAttendanceList();
    const attendanceList = await getTripsTodaysAttendanceListService.execute(id_trip_number);

    return response.json({ data: attendanceList });
  },
);

tripsRouter.patch(
  '/presence',
  ensureAuthenticated,
  async (request, response) => {
    const { id_user, id_trip, status } = request.body;

    const updateUserTripPresenceService = new UpdateUserTripPresenceService();
    const updateResponse = await updateUserTripPresenceService.execute({
      id_user,
      id_trip,
      status
    });

    return response.json({ message: updateResponse });
  },
);

tripsRouter.get(
  '/:id_trip/attendance-list',
  ensureAuthenticated,
  async (request, response) => {
    const { id_trip } = request.params;
    //convert to number
    const id_trip_number = Number(id_trip);

    const getTripsTodaysAttendanceListService = new GetTripsTodaysAttendanceList();
    const attendanceList = await getTripsTodaysAttendanceListService.execute(id_trip_number);

    return response.json({ data: attendanceList });
  },
);

tripsRouter.patch(
  '/presence',
  ensureAuthenticated,
  async (request, response) => {
    const { id_user, id_trip, status } = request.body;

    const updateUserTripPresenceService = new UpdateUserTripPresenceService();
    const updateResponse = await updateUserTripPresenceService.execute({
      id_user,
      id_trip,
      status
    });

    return response.json({ message: updateResponse });
  },
);

export default tripsRouter;
