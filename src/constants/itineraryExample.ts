import Destination from "../models/Destination";
import Itinerary from "../models/Itinerary";
import NeighborhoodServed from "../models/NeighborhoodServed";

const itineraryExample: Itinerary = {
  id_itinerary: 1,
  vehicle_plate: 'ABC1234',
  price: 120.00,
  days_of_week: '0111110',
  specific_day: undefined,
  estimated_departure_time: '17:40:00',
  estimated_arrival_time: '19:00:00',
  available_seats: 5,
  itinerary_nickname: 'Van do Osva',
  // created_at: new Date('2022-09-03T20:54:04'),
  // updated_at: new Date('2022-09-03T20:54:05'),
};

const neighborhoodsServed: NeighborhoodServed[] = [
  {
    id_neighborhood: 1,
    itinerary: itineraryExample,
    name: 'Parque Jambeiro',
    latitude: -22.962812284675504,
    longitude: -47.0504998323243,
    // created_at: new Date('2022-09-03T20:54:04'),
    // updated_at: new Date('2022-09-03T20:54:05'),
  }
];

const destinations: Destination[] = [
  {
    id_destination: 1,
    itinerary: itineraryExample,
    name: 'PUC Campinas 1',
    latitude: -22.83427688865263,
    longitude: -47.048043986779355,
    // created_at: new Date('2022-09-03T20:54:04'),
    // updated_at: new Date('2022-09-03T20:54:05'),
  }
];

export default { itineraryExample, neighborhoodsServed, destinations };
