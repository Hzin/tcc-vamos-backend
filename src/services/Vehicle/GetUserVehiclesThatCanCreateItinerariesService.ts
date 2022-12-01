import { VehicleDocumentType } from '../../enums/VehicleDocumentType';

import FindUserService from '../User/FindUserService';
import EnumUtils from '../../services/Utils/EnumUtils';
import Vehicle from '../../models/Vehicle';
import VehicleDocument from '../../models/VehicleDocument';
import { VehicleDocumentStatus } from '../../enums/VehicleDocumentStatus';

interface Request {
  id_user: string;
}

class GetUserVehiclesThatCanCreateItinerariesService {
  public async execute({ id_user }: Request): Promise<Vehicle[]> {
    const findUserService = new FindUserService();
    const user = await findUserService.execute(id_user);

    // let userVehicles: Vehicle[] = []

    if (!user.vehicles) return []

    // for (let index = 0; index < user.vehicles.length; index++) {
    const userVehicles = user.vehicles.filter((vehicle) =>{
      const vehicleDocuments = vehicle.documents
      if (!vehicleDocuments) return false
      if (vehicleDocuments.length !== EnumUtils.getEnumLength(VehicleDocumentType)) return false
      if (vehicleDocuments.some((document) => { return document.status != VehicleDocumentStatus.approved })) return false

      return true
    })

    return userVehicles
  }
}

export default GetUserVehiclesThatCanCreateItinerariesService;
