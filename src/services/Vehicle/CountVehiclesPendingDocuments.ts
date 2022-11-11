import { VehicleDocumentStatus } from "../../enums/VehicleDocumentStatus";
import FindVehiclesService from "./FindVehiclesService";

class CountVehiclesPendingDocuments {
  public async execute(): Promise<number> {
    const findVehiclesService = new FindVehiclesService()
    const vehicles = await findVehiclesService.execute()

    let count = 0

    vehicles.forEach((vehicle) => {
      if (!vehicle.documents) return

      vehicle.documents.forEach((document) => {
        if (document.status === VehicleDocumentStatus.pending) count++
      })
    })


    return count
  }
}

export default CountVehiclesPendingDocuments;
