import { vehicleDocumentStatus } from '../constants/vehicleDocumentStatus';
import { vehicleDocumentTypes } from '../constants/vehicleDocumentTypes';

import FindVehicleService from './FindVehicleService';
import Utils from './utils/Utils';

interface Request {
  vehicle_plate: string;
}

class CheckIfVehicleCanCreateItineraries {
  public async execute({ vehicle_plate }: Request): Promise<Boolean> {
    const findVehicleService = new FindVehicleService();
    const vehicle = await findVehicleService.execute(vehicle_plate);

    const vehicleDocuments = vehicle.documents

    if (!vehicleDocuments) return false
    if (vehicleDocuments.length !== Utils.getEnumLength(vehicleDocumentTypes)) return false

    return vehicleDocuments.every((document) => { return document.status == vehicleDocumentStatus.approved })
  }
}

export default CheckIfVehicleCanCreateItineraries;
