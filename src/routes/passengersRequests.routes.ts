import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import AddOptionalPropertiesToItineraryObjectService from '../services/utils/AddOptionalPropertiesToObjectService';
import FindPassengerRequestServiceById from '../services/Itinerary/FindPassengerRequestServiceById';
import FindPassengerRequestByUserIdAndItineraryIdService from '../services/Itinerary/FindPassengerRequestByUserIdAndItineraryIdService';

const passengerRequestsRouter = Router();

passengerRequestsRouter.get('/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const findPassengerRequestServiceById = new FindPassengerRequestServiceById()
  let passengerRequest = await findPassengerRequestServiceById.execute(+id);

  const addOptionalPropertiesToItineraryObjectService = new AddOptionalPropertiesToItineraryObjectService()
  passengerRequest = await addOptionalPropertiesToItineraryObjectService.executeSinglePassengerRequest(passengerRequest)

  return response.json({ data: passengerRequest });
})

passengerRequestsRouter.post('/search', ensureAuthenticated, async (request, response) => {
  const { id_user, id_itinerary } = request.body;

  const findPassengerRequestByUserIdAndItineraryIdService = new FindPassengerRequestByUserIdAndItineraryIdService()
  let passengerRequest = await findPassengerRequestByUserIdAndItineraryIdService.execute({ id_user, id_itinerary });

  return response.json({ data: passengerRequest });
})

export default passengerRequestsRouter;
