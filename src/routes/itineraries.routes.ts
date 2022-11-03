import { Router } from 'express';
import { getRepository } from 'typeorm';

import Itinerary from '../models/Itinerary';
import CalculateDistanceBetweenCoords from '../services/CalculateDistanceBetweenCoords';
import CreateItineraryService from '../services/CreateItineraryService';

import maxRadius from '../constants/mapRadiusConfig';
import { SortArrayOfObjects } from '../services/SortArrayOfObjects';

import AddOptionalPropertiesToItineraryObjectService from '../services/AddOptionalPropertiesToItineraryObjectService';

import FindItineraryService from '../services/FindItineraryService';

import CreatePassengerRequestService from '../services/CreatePassengerRequestService';
import CreatePassengerService from '../services/CreatePassengerService';
import UpdatePassengerRequestService from '../services/UpdatePassengerRequestService';
import FindPassengerRequestServiceByFields from '../services/FindPassengerRequestServiceByFields';
import { passengerRequestTypes } from '../constants/passengerRequestTypes';

const itinerariesRouter = Router();

itinerariesRouter.get('/', async (request, response) => {
  const itinerariesRepository = getRepository(Itinerary);

  let itineraries = await itinerariesRepository.find();

  const addOptionalPropertiesToItineraryObjectService = new AddOptionalPropertiesToItineraryObjectService()

  for (let i = 0; i < itineraries.length; i++) {
    itineraries[i] = await addOptionalPropertiesToItineraryObjectService.execute(itineraries[i])
  }

  return response.json({ data: itineraries });
})

itinerariesRouter.get('/:id', async (request, response) => {
  const { id } = request.params

  const findItineraryService = new FindItineraryService();
  let itinerary = await findItineraryService.execute(id)

  const addOptionalPropertiesToItineraryObjectService = new AddOptionalPropertiesToItineraryObjectService()
  itinerary = await addOptionalPropertiesToItineraryObjectService.execute(itinerary)

  return response.json({ data: itinerary });
})

itinerariesRouter.post('/', async (request, response) => {
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

itinerariesRouter.post('/search/inradius', async (request, response) => {
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

  const addOptionalPropertiesToItineraryObjectService = new AddOptionalPropertiesToItineraryObjectService()

  for (let i = 0; i < itinerariesFiltered.length; i++) {
    itinerariesFiltered[i] = await addOptionalPropertiesToItineraryObjectService.execute(itinerariesFiltered[i])
  }

  return response.json({ data: itinerariesFiltered });
});

itinerariesRouter.post('/contract/:id_itinerary', async (request, response) => {
  const {
    id_user,
    address,
    latitude_address,
    longitude_address,
    is_single,
  } = request.body;

  const { id_itinerary } = request.params

  const createPassengerRequestService = new CreatePassengerRequestService()
  const passengerRequest = await createPassengerRequestService.execute({
    id_user,
    id_itinerary: +id_itinerary,
    address,
    latitude_address,
    longitude_address,
    is_single
  })

  return response.json({ data: passengerRequest, message: 'Solicitação enviada com sucesso!' });
});

itinerariesRouter.post('/contract/request/accept', async (request, response) => {
  const { id_user, id_itinerary } = request.body;

  const findPassengerRequestServiceByFields = new FindPassengerRequestServiceByFields()
  const passengerRequest = await findPassengerRequestServiceByFields.execute({
    id_itinerary, id_user
  });

  const updatePassengerRequestService = new UpdatePassengerRequestService()
  const passenger = await updatePassengerRequestService.execute({
    id_passenger_request: passengerRequest.id_passenger_request, status: passengerRequestTypes.accepted
  });

  return response.status(201).json({ data: passenger, message: 'Passageiro aceito com sucesso!' });
});

itinerariesRouter.post('/contract/request/reject', async (request, response) => {
  const { id_user, id_itinerary } = request.body;

  const findPassengerRequestServiceByFields = new FindPassengerRequestServiceByFields()
  const passengerRequest = await findPassengerRequestServiceByFields.execute({
    id_itinerary, id_user
  });

  const updatePassengerRequestService = new UpdatePassengerRequestService()
  const passenger = await updatePassengerRequestService.execute({
    id_passenger_request: passengerRequest.id_passenger_request, status: passengerRequestTypes.rejected
  });

  return response.status(201).json({ data: passenger, message: 'Passageiro recusado com sucesso.' });
});

itinerariesRouter.get('/:id/passengers', async (request, response) => {
  const { id } = request.params;

  const findItineraryService = new FindItineraryService()
  const passengerRequest = await findItineraryService.execute(id);

  return response.json({ data: passengerRequest.passengers });
})

export default itinerariesRouter;
