import { Router } from 'express';
import { getRepository } from 'typeorm';

import Itinerary from '../models/Itinerary';
import CalculateDistanceBetweenCoords from '../services/CalculateDistanceBetweenCoords';
import CreateItineraryService from '../services/CreateItineraryService';

import maxRadius from '../constants/mapRadiusConfig';
import { SortArrayOfObjects } from '../services/utils/SortArrayOfObjects';

import AddOptionalPropertiesToObjectService from '../services/utils/AddOptionalPropertiesToObjectService';

import FindItineraryService from '../services/FindItineraryService';

import CreatePassengerRequestService from '../services/CreatePassengerRequestService';
import UpdatePassengerRequestService from '../services/UpdatePassengerRequestService';
import FindPassengerRequestServiceByFields from '../services/FindPassengerRequestServiceByFields';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import FindItineraryPendingRequests from '../services/FindItineraryPendingRequests';
import FindUserService from '../services/FindUserService';
import FindItinerariesByDriverUserIdService from '../services/FindItinerariesByDriverUserIdService';
import FindItinerariesByPassengerUserIdService from '../services/FindItinerariesByPassengerUserIdService';
import ensureAdmin from '../middlewares/ensureAdmin';

const itinerariesRouter = Router();

// itinerariesRouter.get('/', ensureAdmin, async (request, response) => {
itinerariesRouter.get('/', ensureAuthenticated, async (request, response) => {
  const itinerariesRepository = getRepository(Itinerary);

  let itineraries = await itinerariesRepository.find();

  const addOptionalPropertiesToObjectService = new AddOptionalPropertiesToObjectService()
  itineraries = await addOptionalPropertiesToObjectService.executeArrItinerary(itineraries)

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

  const itinerariesRepository = getRepository(Itinerary);

  const lat_from: number = +coordinatesFrom.lat;
  const lng_from: number = +coordinatesFrom.lng;
  const lat_to: number = +coordinatesTo.lat;
  const lng_to: number = +coordinatesTo.lng;

  const itineraries = await itinerariesRepository.find();

  let itinerariesFiltered = itineraries.filter(itinerary => {
    if (!itinerary.neighborhoods_served || !itinerary.destinations) return false

    var distanceOrigins = 0;
    var distanceDestinations = 0;

    for (const neighborhoodServed of itinerary.neighborhoods_served) {
      let lat2: number = +neighborhoodServed.lat;
      let lng2: number = +neighborhoodServed.lng;
      distanceOrigins = CalculateDistanceBetweenCoords({ lat1: lat_from, lng1: lng_from, lat2, lng2 });
      if (distanceOrigins <= maxRadius) break;
    }

    for (const destination of itinerary.destinations) {
      let lat2: number = +destination.lat;
      let lng2: number = +destination.lng;
      distanceDestinations = CalculateDistanceBetweenCoords({ lat1: lat_to, lng1: lng_to, lat2, lng2 });
      if (distanceDestinations <= maxRadius) break;
    }

    return (distanceOrigins <= maxRadius && distanceDestinations <= maxRadius);
  });

  switch (orderOption) {
    case "monthly_price":
      itinerariesFiltered = SortArrayOfObjects(itinerariesFiltered, 'monthly_price', orderBy ? orderBy : 'ascending')
      break;
    case "daily_price":
      itinerariesFiltered = SortArrayOfObjects(itinerariesFiltered, 'daily_price', orderBy ? orderBy : 'ascending')
      break;
    // case "rating":
    //   itinerariesFiltered = SortArrayOfObjects(itinerariesFiltered, 'rating', orderBy ? orderBy : 'ascending')
    //   break;
    case "available_seats":
      itinerariesFiltered = SortArrayOfObjects(itinerariesFiltered, 'available_seats', orderBy ? orderBy : 'ascending')
      break;
  }

  const addOptionalPropertiesToObjectService = new AddOptionalPropertiesToObjectService()
  itinerariesFiltered = await addOptionalPropertiesToObjectService.executeArrItinerary(itinerariesFiltered)

  return response.json({ data: itinerariesFiltered });
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

  const updatePassengerRequestService = new UpdatePassengerRequestService()
  const passenger = await updatePassengerRequestService.execute({
    id_passenger_request: passengerRequest.id_passenger_request, status
  });

  return response.json({ data: passenger, message: 'Passageiro aceito com sucesso!' });
});

itinerariesRouter.get('/:id/passengers', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const findItineraryService = new FindItineraryService()
  const itinerary = await findItineraryService.execute(id);

  return response.json({ data: itinerary.passengers });
})

itinerariesRouter.get('/:id/contracts/pending', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const findItineraryPendingRequests = new FindItineraryPendingRequests()
  let pendingRequests = await findItineraryPendingRequests.execute(id);

  const addOptionalPropertiesToObjectService = new AddOptionalPropertiesToObjectService()
  pendingRequests = await addOptionalPropertiesToObjectService.executeArrPassengerRequest(pendingRequests)

  return response.json({ data: pendingRequests });
})

export default itinerariesRouter;
