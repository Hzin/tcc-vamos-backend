import { Router } from 'express';
import { getRepository } from 'typeorm';

import Itinerary from '../models/Itinerary';
import CalculateDistanceBetweenCoords from '../services/CalculateDistanceBetweenCoords';
import CreateItineraryService from '../services/CreateItineraryService';

import testData from "../constants/itineraryExample"

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
    id_itinerary,
    vehicle_plate,
    price,
    days_of_week,
    specific_day,
    estimated_departure_time,
    estimated_arrival_time,
    available_seats,
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
    id_itinerary,
    vehicle_plate,
    price,
    days_of_week,
    specific_day,
    estimated_departure_time,
    estimated_arrival_time,
    available_seats,
    itinerary_nickname,
    is_active: true,
    estimated_departure_address,
    departure_latitude,
    departure_longitude,
    neighborhoodsServed,
    destinations
  });

  return response.json({ data: itinerary, message: 'Itinerário criado com sucesso!' });
});

itinerariesRouter.post('/examples', async (request, response) => {
  const createItineraryService = new CreateItineraryService();

  const itinerary = await createItineraryService.execute({
    id_itinerary: testData.itineraryExample1.id_itinerary,
    vehicle_plate: testData.itineraryExample1.vehicle_plate,
    price: testData.itineraryExample1.price,
    days_of_week: testData.itineraryExample1.days_of_week,
    specific_day: testData.itineraryExample1.specific_day,
    estimated_departure_time: testData.itineraryExample1.estimated_departure_time,
    estimated_arrival_time: testData.itineraryExample1.estimated_arrival_time,
    available_seats: testData.itineraryExample1.available_seats,
    is_active: testData.itineraryExample1.is_active,
    estimated_departure_address: testData.itineraryExample1.estimated_departure_address,
    departure_latitude: testData.itineraryExample1.departure_latitude,
    departure_longitude: testData.itineraryExample1.departure_longitude,
    itinerary_nickname: testData.itineraryExample1.itinerary_nickname,
    neighborhoodsServed: testData.neighborhoodsServed1,
    destinations: testData.destinations1,
  });

  const itinerary2 = await createItineraryService.execute({
    id_itinerary: testData.itineraryExample2.id_itinerary,
    vehicle_plate: testData.itineraryExample2.vehicle_plate,
    price: testData.itineraryExample2.price,
    days_of_week: testData.itineraryExample2.days_of_week,
    specific_day: testData.itineraryExample2.specific_day,
    estimated_departure_time: testData.itineraryExample2.estimated_departure_time,
    estimated_arrival_time: testData.itineraryExample2.estimated_arrival_time,
    available_seats: testData.itineraryExample2.available_seats,
    is_active: testData.itineraryExample2.is_active,
    estimated_departure_address: testData.itineraryExample2.estimated_departure_address,
    departure_latitude: testData.itineraryExample2.departure_latitude,
    departure_longitude: testData.itineraryExample2.departure_longitude,
    itinerary_nickname: testData.itineraryExample2.itinerary_nickname,
    neighborhoodsServed: testData.neighborhoodsServed2,
    destinations: testData.destinations2,
  });

  return response.json({ data: itinerary, itinerary2, message: 'Itinerário criado com sucesso!' });
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
    if (!itinerary.neighborhoodsServed || !itinerary.destinations) return false

    var distanceOrigins = 0;
    var distanceDestinations = 0;

    for (const neighborhoodServed of itinerary.neighborhoodsServed) {
      let lat2: number = +neighborhoodServed.latitude;
      let lng2: number = +neighborhoodServed.longitude;
      distanceOrigins = CalculateDistanceBetweenCoords({ lat1: lat_from, lng1: lng_from, lat2, lng2 });
      if (distanceOrigins <= maxRadius) break;
    }

    for (const destination of itinerary.destinations) {
      let lat2: number = +destination.latitude;
      let lng2: number = +destination.longitude;
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
