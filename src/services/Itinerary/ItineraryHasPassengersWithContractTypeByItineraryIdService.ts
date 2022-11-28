import { ItineraryContract } from '../../enums/ItineraryContract';
import FindItineraryService from './FindItineraryService';

interface Request {
  id_itinerary: string,
  contract_type: ItineraryContract
}

class ItineraryHasPassengersWithContractTypeByItineraryIdService {
  public async execute({ id_itinerary, contract_type }: Request): Promise<boolean> {
    const findItineraryService = new FindItineraryService()
    const itinerary = await findItineraryService.execute(id_itinerary)

    return itinerary.passengers.some((passenger) => passenger.contract_type === contract_type)
  }
}

export default ItineraryHasPassengersWithContractTypeByItineraryIdService;
