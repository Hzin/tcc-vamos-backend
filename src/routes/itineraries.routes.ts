import { Router } from 'express';
import { getRepository } from 'typeorm';

import Itinerary from '../models/Itinerary';
import CalculateDistanceBetweenCoords from '../services/CalculateDistanceBetweenCoords';
import CreateItineraryService from '../services/CreateItineraryService';

import maxRadius from '../constants/mapRadiusConfig';
import { SortArrayOfObjects } from '../services/SortArrayOfObjects';

const itinerariesRouter = Router();

itinerariesRouter.get('/', async (request, response) => {
  const itinerariesRepository = getRepository(Itinerary);

  const itineraries = await itinerariesRepository.find();

  return response.json({ data: itineraries });
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
    // is_active,
    estimated_departure_address,
    departure_latitude,
    departure_longitude,
    neighborhoodsServed,
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
    is_active: true,
    estimated_departure_address,
    departure_latitude,
    departure_longitude,
    neighborhoodsServed,
    destinations
  });

  return response.status(201).json({ data: itinerary, message: 'Itinerário criado com sucesso!' });
});

itinerariesRouter.post('/search/inradius', async (request, response) => {
  const { coordinatesOrigin, coordinatesDestination, orderOption, orderBy, preference_AvulseSeat, preference_A_C, preference_PrioritySeat } = request.body;

  const itinerariesRepository = getRepository(Itinerary);

  const lat_from: number = +coordinatesOrigin.lat;
  const lng_from: number = +coordinatesOrigin.lng;
  const lat_to: number = +coordinatesDestination.lat;
  const lng_to: number = +coordinatesDestination.lng;

  const itineraries = await itinerariesRepository.find();

  let transportsFiltered = itineraries.filter(itinerary => {
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

  let newOrderBy = orderBy

  if (!newOrderBy) newOrderBy = 'ascending'

  switch (orderOption) {
    case "lower_price":
      transportsFiltered = SortArrayOfObjects(transportsFiltered, 'price', newOrderBy)
      break;
    // case "ratings":
    //   transportsFiltered = SortArrayOfObjects(transportsFiltered, 'rating', newOrderBy)
    //   break;
    case "available_seats":
      transportsFiltered = SortArrayOfObjects(transportsFiltered, 'available_seats', newOrderBy)
      break;
  }

  return response.json({ data: transportsFiltered });
});

export default itinerariesRouter;
