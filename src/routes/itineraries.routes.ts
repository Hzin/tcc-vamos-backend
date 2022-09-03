import { Router } from 'express';
import { getRepository } from 'typeorm';
import axios from 'axios'

import AppError from '../errors/AppError';
import Itinerary from '../models/Itinerary';
import CalculateDistanceBetweenCoords from '../services/CalculateDistanceBetweenCoords';
import CreateItineraryService from '../services/CreateItineraryService';
import NeighborhoodServed from '../models/NeighborhoodServed';
import Destination from '../models/Destination';

import testData from "../constants/itineraryExample"

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
  const { coordinatesFrom, coordinatesTo } = request.body;
  console.log(coordinatesFrom, coordinatesTo);

  let lat_from: number = +coordinatesFrom.lat;
  let lng_from: number = +coordinatesFrom.lng;
  let lat_to: number = +coordinatesTo.lat;
  let lng_to: number = +coordinatesTo.lng;

  const { data, status } = await axios.get<Itinerary[]>(
    'https://630d4f7fb37c364eb702a43d.mockapi.io/vehiclemos/itineraries',
    {
      headers: {
        Accept: 'application/json',
      },
    },
  );

  if (status !== 200) {
    throw new AppError('Não foi possível recuperar a lista de modelos do veículo informado.', 200);
  }

  console.log(data)

  // "data" é a lista de itinerários
  let transportsFiltered = data.filter(x => {
    var distance = 0;
    var distance2 = 0;
    for (const i of x.bairros_atendidos) {
      let lat2: number = +i.lat;
      let lng2: number = +i.lgn;
      distance = CalculateDistanceBetweenCoords({ lat1: lat_from, lng1: lng_from, lat2, lng2 });
      if (distance <= 10) break;
    }

    for (const j of x.destinos) {
      let lat2: number = +j.lat;
      let lng2: number = +j.lgn;
      distance2 = CalculateDistanceBetweenCoords({ lat1: lat_to, lng1: lng_to, lat2, lng2 });
      if (distance2 <= 10) break;
    }

    return (distance <= 10 && distance2 <= 10);
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
