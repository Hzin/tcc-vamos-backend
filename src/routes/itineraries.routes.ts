import { Router } from 'express';
import { getRepository } from 'typeorm';

import Itinerary from '../models/Itinerary';
import CalculateDistanceBetweenCoords from '../services/CalculateDistanceBetweenCoords';
import CreateItineraryService from '../services/CreateItineraryService';

import testData from "../constants/itineraryExample"

import maxRadius from '../constants/mapRadiusConfig';

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
    neighborhoodsServed,
    destinations
  });

  return response.json({ data: itinerary, message: 'Itinerário criado com sucesso!' });
});

itinerariesRouter.post('/examples', async (request, response) => {
  const createItineraryService = new CreateItineraryService();

  const itinerary = await createItineraryService.execute({
    id_itinerary: testData.itineraryExample.id_itinerary,
    vehicle_plate: testData.itineraryExample.vehicle_plate,
    price: testData.itineraryExample.price,
    days_of_week: testData.itineraryExample.days_of_week,
    specific_day: testData.itineraryExample.specific_day,
    estimated_departure_time: testData.itineraryExample.estimated_departure_time,
    estimated_arrival_time: testData.itineraryExample.estimated_arrival_time,
    available_seats: testData.itineraryExample.available_seats,
    itinerary_nickname: testData.itineraryExample.itinerary_nickname,
    neighborhoodsServed: testData.neighborhoodsServed,
    destinations: testData.destinations,
  });

  return response.json({ data: itinerary, message: 'Itinerário criado com sucesso!' });
});

itinerariesRouter.post('/inradius', async (request, response) => {
  const { coordinatesOrigin, coordinatesDestination } = request.body;

  const itinerariesRepository = getRepository(Itinerary);
  // console.log(coordinatesOrigin, coordinatesDestiny);

  const lat_from: number = +coordinatesOrigin.lat;
  const lng_from: number = +coordinatesOrigin.lng;
  const lat_to: number = +coordinatesDestination.lat;
  const lng_to: number = +coordinatesDestination.lng;

  const itineraries = await itinerariesRepository.find();

  let transportsFiltered = itineraries.filter(itinerary => {
    if (!itinerary.neighborhoodsServed || !itinerary.destinations) return false

    var distance = 0;
    var distance2 = 0;

    for (const neighborhoodServed of itinerary.neighborhoodsServed) {
      let lat2: number = +neighborhoodServed.latitude;
      let lng2: number = +neighborhoodServed.longitude;
      distance = CalculateDistanceBetweenCoords({ lat1: lat_from, lng1: lng_from, lat2, lng2 });
      if (distance <= maxRadius) break;
    }

    for (const destination of itinerary.destinations) {
      let lat2: number = +destination.latitude;
      let lng2: number = +destination.longitude;
      distance2 = CalculateDistanceBetweenCoords({ lat1: lat_to, lng1: lng_to, lat2, lng2 });
      if (distance2 <= maxRadius) break;
    }

    return (distance <= maxRadius && distance2 <= maxRadius);
  });

  console.log(transportsFiltered)
  return response.json(transportsFiltered);
});

itinerariesRouter.post('/', async (request, response) => {
  const itinerariesRepository = getRepository(Itinerary);
  // const itinerary = itinerariesRepository.create();

  // return user;
})

export default itinerariesRouter;
