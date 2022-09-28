import { Router } from 'express';
import { getRepository } from 'typeorm';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import CheckIfUserHasVehiclesService from '../services/CheckIfUserHasVehiclesService';
import Trip from '../models/Trip';
import FindTripService from '../services/FindTripService';
import CreateTripService from '../services/CreateTripService';
import UpdateTripStatusService from '../services/UpdateTripStatusService';
import UpdateTripNicknameService from '../services/UpdateTripNicknameService';
import GetUserTripsFeedService from '../services/GetUserTripsFeedService';
import DateUtils from '../services/utils/Date';
import GetItineraryTodaysTripStatusService from '../services/GetItineraryTodaysTripStatusService';
import { tripStatus } from '../constants/tripStatus';

const tripsRouter = Router();

interface userWithoutSensitiveInfo {
  id_user: string;
  name: string;
  email: string;
  avatar_image: string;
}

tripsRouter.get('/list', async (request, response) => {
  const tripsRepository = getRepository(Trip);

  const trips = await tripsRepository.find();

  return response.json({ data: trips });
});

tripsRouter.get('/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const findTripService = new FindTripService();

  const trip = await findTripService.execute(id);

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

  const trip = await createTripService.execute(
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
  '/user/:id_user',
  ensureAuthenticated,
  async (request, response) => {
    const { id_user } = request.params;

    const checkIfUserHasVehiclesService = new CheckIfUserHasVehiclesService();

    const userHasVehicles = await checkIfUserHasVehiclesService.execute({
      id_user,
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
  '/feed/today',
  ensureAuthenticated,
  async (request, response) => {
    const getUserTripsFeedService = new GetUserTripsFeedService();
    const userTripsFeed = await getUserTripsFeedService.execute(request.user.id_user, true);

    return response.json({ data: userTripsFeed });
  },
);

tripsRouter.get(
  '/feed/nottoday',
  ensureAuthenticated,
  async (request, response) => {
    const getUserTripsFeedService = new GetUserTripsFeedService();
    const userTripsFeed = await getUserTripsFeedService.execute(request.user.id_user, false);

    return response.json({ data: userTripsFeed });
  },
);

export default tripsRouter;
