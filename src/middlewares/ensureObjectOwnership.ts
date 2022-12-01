import { Request, Response, NextFunction } from 'express';

import ensureAuthenticated from './ensureAuthenticated';

import StringUtils from '../services/Utils/String';
import FindUserService from '../services/User/FindUserService';
import FindVehicleService from '../services/Vehicle/FindVehicleService';
import FindItinerariesByDriverUserIdService from '../services/Itinerary/FindItinerariesByDriverUserIdService';
import FindItineraryService from '../services/Itinerary/FindItineraryService';

function findExistingParam(params: string[]): any {
  return params.find(param => {
    return !!param;
  });
}

export default function ensureObjectOwnership(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  ensureAuthenticated(request, response, async () => {
    let middlewareFailedFlag = undefined
    try {
      const findUserService = new FindUserService();
      
      const user = await findUserService.execute(request.user.id_user);

      const objectName = StringUtils.replaceAll(request.baseUrl, '/', '');
      switch (objectName) {
        case 'vehicles':
          console.log('loucura')
          console.log('request.params')
          console.log(request.params)
          console.log('request.body')
          console.log(request.body)
          
          const vehiclePlate = findExistingParam(
            [
              request.params.plate,
              request.params.vehicle_plate,
              request.body.vehicle_plate,
            ]
          )          

          console.log('vehiclePlate')
          console.log(vehiclePlate)
          const findVehicleService = new FindVehicleService();
          const vehicle = await findVehicleService.execute(vehiclePlate);

          console.log('vehicle.user_id')
          console.log(vehicle.user_id)
          console.log('user.id_user')
          console.log(user.id_user)

          if (vehicle.user_id != user.id_user) middlewareFailedFlag = 'Você não é o proprietário deste veículo.'
          break;
        case 'itineraries':
          const itineraryId = findExistingParam(
            [
              request.body.id_itinerary,
              request.params.id
            ]
          )

          const findItineraryService = new FindItineraryService()
          const itinerary = await findItineraryService.execute(itineraryId)

          const findItinerariesByDriverUserIdService = new FindItinerariesByDriverUserIdService()
          const driverItineraries = await findItinerariesByDriverUserIdService.execute(user.id_user)
          let driverItinerariesIds: number[] = []
          driverItineraries.forEach((itinerary) => { driverItinerariesIds.push(itinerary.id_itinerary) })

          if (!driverItinerariesIds.includes(itinerary.id_itinerary)) middlewareFailedFlag = 'Você não é o proprietário deste itinerário.'
          break;
        case 'trips':
          break;

        default:
          middlewareFailedFlag = `A rota acionada está usando o middleware "ensureObjectOwnership", mas não há lógica configurada para o objeto da rota (${objectName}).`
          break;
      }
    } catch (err) {
      // middlewareFailedFlag = 'Invalid JWT token (ensureObjectOwnership)'
      middlewareFailedFlag = err
    }

    if (middlewareFailedFlag) return response.json({ message: middlewareFailedFlag, statusCode: 401})

    next()
  });
}
