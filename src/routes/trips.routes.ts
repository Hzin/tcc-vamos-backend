import { Router } from 'express';
import { getRepository } from 'typeorm';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import CheckIfUserHasVehiclesService from '../services/User/CheckIfUserHasVehiclesService';
import Trip from '../models/Trip';
import FindTripService from '../services/Trip/FindTripService';
import CreateTripService from '../services/Trip/CreateTripService';
import UpdateTripStatusService from '../services/Trip/UpdateTripStatusService';
import UpdateTripNicknameService from '../services/Trip/UpdateTripNicknameService';
import GetUserTripsFeedService from '../services/Trip/GetUserTripsFeedService';
import GetItineraryTodaysTripStatusService from '../services/Trip/GetItineraryTodaysTripStatusService';
import { tripStatus } from '../constants/tripStatus';
import FindTodaysTripByItineraryIdService from '../services/Trip/FindTodaysTripByItineraryIdService';
import FindItineraryTrips from '../services/Trip/FindItineraryTrips';
import AddOptionalPropertiesToItineraryObjectService from '../services/utils/AddOptionalPropertiesToObjectService';

const tripsRouter = Router();

interface userWithoutSensitiveInfo {
  id_user: string;
  name: string;
  email: string;
  avatar_image: string;
}

tripsRouter.get('/list', async (request, response) => {
  const tripsRepository = getRepository(Trip);

  let trips = await tripsRepository.find();

  const addOptionalPropertiesToObjectService = new AddOptionalPropertiesToItineraryObjectService()
  trips = await addOptionalPropertiesToObjectService.executeArrTrip(trips)

  return response.json({ data: trips });
});

tripsRouter.get('/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const findTripService = new FindTripService();
  let trip = await findTripService.execute(id);

  const addOptionalPropertiesToObjectService = new AddOptionalPropertiesToItineraryObjectService()
  trip = await addOptionalPropertiesToObjectService.executeSingleTrip(trip)

  return response.json({ data: trip });
});

tripsRouter.get('/itinerary/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const findItineraryTrips = new FindItineraryTrips();
  let trips = await findItineraryTrips.execute(id);

  const addOptionalPropertiesToObjectService = new AddOptionalPropertiesToItineraryObjectService()
  trips = await addOptionalPropertiesToObjectService.executeArrTrip(trips)

  return response.json({ data: trips });
});

tripsRouter.get('today/itinerary/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const findTodaysTripByItineraryIdService = new FindTodaysTripByItineraryIdService();
  let trip = await findTodaysTripByItineraryIdService.execute(id)

  const addOptionalPropertiesToObjectService = new AddOptionalPropertiesToItineraryObjectService()
  trip = await addOptionalPropertiesToObjectService.executeSingleTrip(trip)

  return response.json({ data: trip });
});

tripsRouter.post('/update/confirm', async (request, response) => {
  const { id_itinerary } = request.body;

  const createTripService = new CreateTripService();

  const trip = await createTripService.execute(
    id_itinerary,
    tripStatus.confirmed
  );

  return response.json({ message: 'Viagem confirmada com sucesso!', data: trip });
});

tripsRouter.post('/update/cancel', async (request, response) => {
  const { id_itinerary } = request.body;

  const createTripService = new CreateTripService();

  await createTripService.execute(
    id_itinerary,
    tripStatus.canceled
  );

  return response.json({ message: 'Viagem cancelada com sucesso.' });
});

tripsRouter.patch('/update/nickname', ensureAuthenticated, async (request, response) => {
  const { id_trip, nickname } = request.body;

  const updateTripNicknameService = new UpdateTripNicknameService();

  await updateTripNicknameService.execute({
    id_trip, nickname
  });

  return response.json({ message: 'Apelido da viagem atualizado com sucesso!' });
});

tripsRouter.patch('/update/status', ensureAuthenticated, async (request, response) => {
  const { id_trip, new_status, description } = request.body;

  const updateTripStatusService = new UpdateTripStatusService();
  await updateTripStatusService.execute({
    id_trip, new_status, description
  });

  return response.json({ message: 'Status da viagem atualizado com sucesso!' });
});

// TODO, incluir filtros dependendo de status
tripsRouter.get(
  '/user/:id',
  ensureAuthenticated,
  async (request, response) => {
    const { id } = request.params;

    const checkIfUserHasVehiclesService = new CheckIfUserHasVehiclesService();

    const userHasVehicles = await checkIfUserHasVehiclesService.execute({
      id_user: id,
    });

    return response.json({ result: userHasVehicles });
  },
);

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
tripsRouter.get(
  '/today/status/itinerary/:id_itinerary',
  ensureAuthenticated,
  async (request, response) => {
    const { id_itinerary } = request.params;

    const getItineraryTodaysTripStatusService = new GetItineraryTodaysTripStatusService()
    const tripStatus = await getItineraryTodaysTripStatusService.execute(id_itinerary)

    return response.json({ data: tripStatus });
  },
);

tripsRouter.get(
  '/feed/driver/today',
  ensureAuthenticated,
  async (request, response) => {
    const getUserTripsFeedService = new GetUserTripsFeedService();
    const userTripsFeed = await getUserTripsFeedService.execute({
      id_user: request.user.id_user,
      tripsType: 'today',
      userType: 'driver',
    });

    return response.json({ data: userTripsFeed });
  },
);

tripsRouter.get(
  '/feed/driver/nottoday',
  ensureAuthenticated,
  async (request, response) => {
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
  '/feed/passenger/today',
  ensureAuthenticated,
  async (request, response) => {
    const getUserTripsFeedService = new GetUserTripsFeedService();
    const userTripsFeed = await getUserTripsFeedService.execute({
      id_user: request.user.id_user,
      tripsType: 'today',
      userType: 'passenger',
    });

    return response.json({ data: userTripsFeed });
  },
);

tripsRouter.get(
  '/feed/passenger/nottoday',
  ensureAuthenticated,
  async (request, response) => {
    const getUserTripsFeedService = new GetUserTripsFeedService();
    const userTripsFeed = await getUserTripsFeedService.execute({
      id_user: request.user.id_user,
      tripsType: 'not_today',
      userType: 'passenger',
    });

    return response.json({ data: userTripsFeed });
  },
);

export default tripsRouter;
