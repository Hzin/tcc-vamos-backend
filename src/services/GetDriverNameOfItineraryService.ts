
import AppError from '../errors/AppError';
import FindVehicleByItineraryIdService from './FindVehicleByItineraryIdService';
import FindUserByVehiclePlateService from './FindUserByVehiclePlateService';

class GetDriverNameOfItinerary {
  public async execute(id_itinerary: number): Promise<string> {
    const findVehicleByItineraryIdService = new FindVehicleByItineraryIdService()
    const vehicle = await findVehicleByItineraryIdService.execute("" + id_itinerary)

    const findUserByVehiclePlateService = new FindUserByVehiclePlateService()
    const user = await findUserByVehiclePlateService.execute(vehicle.plate)

    if (!user) throw new AppError("Não foi encontrado o motorista desse veículo.")

    return `${user.name} ${user.lastname}`
  }
}

export default GetDriverNameOfItinerary;
