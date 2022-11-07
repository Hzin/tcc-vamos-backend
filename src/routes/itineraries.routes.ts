import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ensureAdmin from '../middlewares/ensureAdmin';

import CreateItineraryService from '../services/CreateItineraryService';
import FindItineraryService from '../services/FindItineraryService';
import CreatePassengerRequestService from '../services/CreatePassengerRequestService';
import UpdatePassengerRequestService from '../services/UpdatePassengerRequestService';
import FindPassengerRequestServiceByFields from '../services/FindPassengerRequestServiceByFields';
import FindUserService from '../services/FindUserService';
import FindItinerariesByDriverUserIdService from '../services/FindItinerariesByDriverUserIdService';
import FindItinerariesByPassengerUserIdService from '../services/FindItinerariesByPassengerUserIdService';
import FindItineraryBySearchFiltersService from '../services/FindItineraryBySearchFiltersService';
import FindItinerariesExceptUserss from '../services/FindItinerariesExceptUserss';

import AddOptionalPropertiesToObjectService from '../services/utils/AddOptionalPropertiesToObjectService';
import FindItineraryPendingRequests from '../services/FindItineraryPendingRequests';
import FindDriverItinerariesOnlyWithPendingRequests from '../services/FindDriverItinerariesOnlyWithPendingRequests';
import CountItinerariesPendingPassengerRequestsByDriverId from '../services/CountItinerariesPendingPassengerRequestsByDriverId';

const itinerariesRouter = Router();

// itinerariesRouter.get('/', ensureAdmin, async (request, response) => {
itinerariesRouter.get('/', ensureAuthenticated, async (request, response) => {
  const findItinerariesExceptUserss = new FindItinerariesExceptUserss()
  const itineraries = await findItinerariesExceptUserss.execute(request.user.id_user)

  return response.json({ data: itineraries });
})

itinerariesRouter.get('/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params

  const findItineraryService = new FindItineraryService();
  let itinerary = await findItineraryService.execute(id)

  const addOptionalPropertiesToObjectService = new AddOptionalPropertiesToObjectService()
  itinerary = await addOptionalPropertiesToObjectService.executeSingleItinerary(itinerary)

  return response.json({ data: itinerary });
})

itinerariesRouter.post('/search/inradius', ensureAuthenticated, async (request, response) => {
  const { coordinatesFrom, coordinatesTo, orderOption, orderBy, preference_AvulseSeat, preference_A_C, preference_PrioritySeat } = request.body;

  const findItineraryBySearchFiltersService = new FindItineraryBySearchFiltersService()
  const itineraries = await findItineraryBySearchFiltersService.execute({
    user_id: request.user.id_user,
    coordinatesFrom,
    coordinatesTo,
    orderOption,
    orderBy,
    preference_AvulseSeat,
    preference_A_C,
    preference_PrioritySeat
  })

  return response.json({ data: itineraries });
});

itinerariesRouter.get('/driver/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params

  const findItinerariesByDriverUserIdService = new FindItinerariesByDriverUserIdService();
  let itineraries = await findItinerariesByDriverUserIdService.execute(id)

  const addOptionalPropertiesToObjectService = new AddOptionalPropertiesToObjectService()
  itineraries = await addOptionalPropertiesToObjectService.executeArrItinerary(itineraries)

  return response.json({ data: itineraries });
})

itinerariesRouter.get('/passenger/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params

  const findItinerariesByPassengerUserIdService = new FindItinerariesByPassengerUserIdService();
  let itineraries = await findItinerariesByPassengerUserIdService.execute(id)

  const addOptionalPropertiesToObjectService = new AddOptionalPropertiesToObjectService()
  itineraries = await addOptionalPropertiesToObjectService.executeArrItinerary(itineraries)

  return response.json({ data: itineraries });
})

itinerariesRouter.post('/', ensureAuthenticated, async (request, response) => {
  const {
    vehicle_plate,
    days_of_week,
    specific_day,
    estimated_departure_time,
    estimated_arrival_time,
    monthly_price,
    daily_price,
    accept_daily,
    itinerary_nickname,
    estimated_departure_address,
    departure_latitude,
    departure_longitude,
    neighborhoods_served,
    destinations
  } = request.body;

  const createItineraryService = new CreateItineraryService();

  const itinerary = await createItineraryService.execute({
    vehicle_plate,
    days_of_week,
    specific_day,
    estimated_departure_time,
    estimated_arrival_time,
    monthly_price,
    daily_price,
    accept_daily,
    itinerary_nickname,
    estimated_departure_address,
    departure_latitude,
    departure_longitude,
    neighborhoods_served,
    destinations
  });

  return response.status(201).json({ data: itinerary, message: 'Itinerário criado com sucesso!' });
});

// cria registro na tabela passenger_requests
itinerariesRouter.post('/contract/:id_itinerary', ensureAuthenticated, async (request, response) => {
  const {
    period,
    contract_type,
    lat_origin,
    lng_origin,
    formatted_address_origin,
    lat_destination,
    lng_destination,
    formatted_address_destination,
  } = request.body;

  const { id_itinerary } = request.params

  const createPassengerRequestService = new CreatePassengerRequestService()
  const passengerRequest = await createPassengerRequestService.execute({
    id_user: request.user.id_user,
    id_itinerary: +id_itinerary,
    contract_type,
    period,
    lat_origin,
    lng_origin,
    formatted_address_origin,
    lat_destination,
    lng_destination,
    formatted_address_destination,
  })

  return response.json({ data: passengerRequest, message: 'Solicitação enviada com sucesso!' });
});

itinerariesRouter.patch('/contract/status', ensureAuthenticated, async (request, response) => {
  const { id_user, id_itinerary, status } = request.body;

  const findUserService = new FindUserService()
  const user = await findUserService.execute(id_user);

  const findItineraryService = new FindItineraryService()
  const itinerary = await findItineraryService.execute(id_itinerary);

  const findPassengerRequestServiceByFields = new FindPassengerRequestServiceByFields()
  const passengerRequest = await findPassengerRequestServiceByFields.execute({
    user, itinerary
  });

  // cria registro na tabela passengers se status for 'APPROVED'
  const updatePassengerRequestService = new UpdatePassengerRequestService()
  const { passengerRequestWithUpdatedStatus, message } = await updatePassengerRequestService.execute({
    id_passenger_request: passengerRequest.id_passenger_request, status
  });

  return response.json({ data: passengerRequestWithUpdatedStatus, message: message });
});

itinerariesRouter.get('/:id/contracts/pending', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const findItineraryPendingRequests = new FindItineraryPendingRequests()
  let pendingRequests = await findItineraryPendingRequests.execute(id);

  const addOptionalPropertiesToObjectService = new AddOptionalPropertiesToObjectService()
  pendingRequests = await addOptionalPropertiesToObjectService.executeArrPassengerRequest(pendingRequests)

  return response.json({ data: pendingRequests });
})

itinerariesRouter.get('/driver/contracts/pending/count', ensureAuthenticated, async (request, response) => {
  const countItinerariesPendingPassengerRequestsByDriverId = new CountItinerariesPendingPassengerRequestsByDriverId()
  let pendingContractsCount = await countItinerariesPendingPassengerRequestsByDriverId.execute({ id_user: request.user.id_user });

  return response.json({ data: pendingContractsCount });
})

itinerariesRouter.get('/driver/:id/onlypendingrequests', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const findDriverItinerariesOnlyWithPendingRequests = new FindDriverItinerariesOnlyWithPendingRequests()
  let itineraries = await findDriverItinerariesOnlyWithPendingRequests.execute(id);

  const addOptionalPropertiesToObjectService = new AddOptionalPropertiesToObjectService()
  itineraries = await addOptionalPropertiesToObjectService.executeArrItinerary(itineraries)

  return response.json({ data: itineraries });
})

export default itinerariesRouter;
