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
    destinations,
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
    destinations,
  });

  return response.status(201).json({ data: itinerary, message: 'Itinerário criado com sucesso!' });
});

// itinerariesRouter.post('/examples', async (request, response) => {
//   const createItineraryService = new CreateItineraryService();

//   const itinerary = await createItineraryService.execute({
//     id_itinerary: testData.itineraryExample.id_itinerary,
//     vehicle_plate: testData.itineraryExample.vehicle_plate,
//     price: testData.itineraryExample.price,
//     days_of_week: testData.itineraryExample.days_of_week,
//     specific_day: testData.itineraryExample.specific_day,
//     estimated_departure_time: testData.itineraryExample.estimated_departure_time,
//     estimated_arrival_time: testData.itineraryExample.estimated_arrival_time,
//     available_seats: testData.itineraryExample.available_seats,
//     itinerary_nickname: testData.itineraryExample.itinerary_nickname,
//     neighborhoodsServed: testData.neighborhoodsServed,
//     destinations: testData.destinations,
//   });

//   return response.json({ data: itinerary, message: 'Itinerário criado com sucesso!' });
// });

itinerariesRouter.post('/search/inradius', async (request, response) => {
  const { coordinatesFrom, coordinatesTo } = request.body;

  const itinerariesRepository = getRepository(Itinerary);

  const lat_from: number = +coordinatesFrom.lat;
  const lng_from: number = +coordinatesFrom.lng;
  const lat_to: number = +coordinatesTo.lat;
  const lng_to: number = +coordinatesTo.lng;

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

    console.log('distanceOrigins: ' + distanceOrigins)
    console.log('distanceDestinations: ' + distanceDestinations)

    return (distanceOrigins <= maxRadius && distanceDestinations <= maxRadius);
  });

  return response.json({ data: transportsFiltered });
});

export default itinerariesRouter;
