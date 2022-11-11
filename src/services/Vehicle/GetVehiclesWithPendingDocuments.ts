import {  getRepository } from 'typeorm';
import { VehicleDocumentStatus } from '../../enums/VehicleDocumentStatus';
import Vehicle from '../../models/Vehicle';

interface ReturnObj {
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_picture: string;

  document_type: string;
  document_status: string;
  document_url: string;
}

class GetVehiclesWithPendingDocuments {
  public async execute(): Promise<ReturnObj[]> {
    const vehiclesRepository = getRepository(Vehicle)

    const vehicles = await vehiclesRepository.find()

    let obj: ReturnObj[] = []

    vehicles.forEach((vehicle) => {
      if (vehicle.documents) {
        vehicle.documents.forEach((document) => {
          // tá escrito sem "return" porque vai dar errado
          if (document.status === VehicleDocumentStatus.pending)  {
            const newElement = {
              vehicle_brand: vehicle.brand,
              vehicle_model: vehicle.model,
              vehicle_plate: vehicle.plate,
              vehicle_picture: vehicle.picture,

              document_type: document.document_type,
              document_status: document.status,
              document_url: document.path,
            }

            obj.push(newElement)
          }
        })
      }
    })

    return obj
  }
}

export default GetVehiclesWithPendingDocuments;
