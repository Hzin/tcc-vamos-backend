import { getRepository } from "typeorm";

import Itinerary from "../models/Itinerary";
import maxRadius from '../constants/mapRadiusConfig';

import CalculateDistanceBetweenCoords from '../services/CalculateDistanceBetweenCoords';

import AddOptionalPropertiesToItineraryObjectService from "./utils/AddOptionalPropertiesToObjectService";
import { SortArrayOfObjects } from "./utils/SortArrayOfObjects";
import FindItinerariesByDriverUserIdService from "./FindItinerariesByDriverUserIdService";
import FindItinerariesByPassengerUserIdService from "./FindItinerariesByPassengerUserIdService";

interface Request {
  user_id: string;

  // location parameters
  coordinatesFrom: {
    lat: number,
    lng: number,
  }
  coordinatesTo: {
    lat: number,
    lng: number,
  };

  // filters
  orderOption?: "monthly_price" | "daily_price" | "rating" | "available_seats";
  orderBy: 'ascending' | 'descending' | 'none';
  preference_AvulseSeat: string;
  preference_A_C: string;
  preference_PrioritySeat: string;
}

class FindItineraryBySearchFiltersService {
  public async execute({ user_id, coordinatesFrom, coordinatesTo, orderOption, orderBy, preference_AvulseSeat, preference_A_C, preference_PrioritySeat }: Request): Promise<Itinerary[]> {
    const itinerariesRepository = getRepository(Itinerary);

    const lat_from: number = +coordinatesFrom.lat;
    const lng_from: number = +coordinatesFrom.lng;
    const lat_to: number = +coordinatesTo.lat;
    const lng_to: number = +coordinatesTo.lng;

    const findItinerariesByDriverUserIdService = new FindItinerariesByDriverUserIdService()
    const itinerariesUserIsInAsDriver = await findItinerariesByDriverUserIdService.execute(user_id)

    const findItinerariesByPassengerUserIdService = new FindItinerariesByPassengerUserIdService()
    const itinerariesUserIsInAsPassenger = await findItinerariesByPassengerUserIdService.execute(user_id)

    const itineraries = await itinerariesRepository.find();
    const itinerariesFiltered = itineraries.filter(itinerary => {
      if (!itinerary.neighborhoods_served || !itinerary.destinations) return false

      if (itinerariesUserIsInAsDriver.some(itineraryUserIsInAsDriver => itineraryUserIsInAsDriver.id_itinerary === itinerary.id_itinerary)) return false
      if (itinerariesUserIsInAsPassenger.some(itineraryUserIsInAsPassenger => itineraryUserIsInAsPassenger.id_itinerary === itinerary.id_itinerary)) return false

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

      // console.log(`distanceOrigins: ${distanceOrigins}`)
      // console.log(`distanceDestinations: ${distanceDestinations}`)

      return (distanceOrigins <= maxRadius && distanceDestinations <= maxRadius);
    })

    // filters
    let itinerariesFilteredWithFilters: Itinerary[] = itinerariesFiltered
    if (orderOption) {
      switch (orderOption) {
        case "monthly_price":
          itinerariesFilteredWithFilters = SortArrayOfObjects(itinerariesFiltered, 'monthly_price', orderBy ? orderBy : 'ascending')
          break;
        case "daily_price":
          itinerariesFilteredWithFilters = SortArrayOfObjects(itinerariesFiltered, 'daily_price', orderBy ? orderBy : 'ascending')
          break;
        // case "rating":
        //   itinerariesFilteredWithFilters = SortArrayOfObjects(itinerariesFiltered, 'rating', orderBy ? orderBy : 'ascending')
        //   break;
        case "available_seats":
          itinerariesFilteredWithFilters = SortArrayOfObjects(itinerariesFiltered, 'available_seats', orderBy ? orderBy : 'ascending')
          break;
      }
    }

    // TODO, preferences

    const addOptionalPropertiesToItineraryObjectService = new AddOptionalPropertiesToItineraryObjectService()
    const itinerariesFilteredWithUserAndVehicleInfo = await addOptionalPropertiesToItineraryObjectService.executeArrItinerary(itinerariesFilteredWithFilters)

    return itinerariesFilteredWithUserAndVehicleInfo
  }
}

export default FindItineraryBySearchFiltersService;
