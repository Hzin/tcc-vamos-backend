import { Request, Response, NextFunction } from 'express';

import ensureAuthenticated from './ensureAuthenticated';

import admin from '../config/admin';
import AppError from '../errors/AppError';
import StringUtils from '../services/Utils/String';
import FindUserService from '../services/User/FindUserService';
import FindVehicleService from '../services/Vehicle/FindVehicleService';
import User from '../models/User';
import Vehicle from '../models/Vehicle';

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
          const vehiclePlate = [
            request.params.plate,
            request.params.vehicle_plate,
            request.body.vehicle_plate,
          ].find(param => {
            return !!param;
          });

          const findVehicleService = new FindVehicleService();
          const vehicle = await findVehicleService.execute(vehiclePlate);

          // if (vehicle.user_id !== user.id_user) throw new AppError('Você não é o proprietário deste veículo.', 401);
          if (vehicle.user_id !== user.id_user) middlewareFailedFlag = 'Você não é o proprietário deste veículo.'
          break;
        case 'itineraries':
          break;
        case 'trips':
          break;

        default:
          // throw new AppError(
          //   `A rota acionada está usando o middleware "ensureObjectOwnership", mas não há lógica configurada para o objeto da rota (${objectName}).`,
          // );

          middlewareFailedFlag = `A rota acionada está usando o middleware "ensureObjectOwnership", mas não há lógica configurada para o objeto da rota (${objectName}).`
          break;
      }

      // return response.json({ message: "Cancelando rota prematuramente" })
    } catch (err) {
      // console.log('err');
      // console.log(err);
      // throw new AppError('Invalid JWT token (ensureObjectOwnership)', 401);
      middlewareFailedFlag = 'Invalid JWT token (ensureObjectOwnership)'
    }

    // if (middlewareFailedFlag) throw new AppError(middlewareFailedFlag, 401);
    if (middlewareFailedFlag) return response.json({ message: middlewareFailedFlag, statusCode: 401})
    else next()
  });
}
