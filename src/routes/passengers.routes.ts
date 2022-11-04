import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ensureAdmin from '../middlewares/ensureAdmin';

import FindItineraryService from '../services/FindItineraryService';
import AddOptionalPropertiesToItineraryObjectService from '../services/utils/AddOptionalPropertiesToObjectService';

const passengersRouter = Router();

passengersRouter.get('/itinerary/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const findItineraryService = new FindItineraryService()
  const itinerary = await findItineraryService.execute(id);

  const addOptionalPropertiesToItineraryObjectService = new AddOptionalPropertiesToItineraryObjectService()
  const passengers = await addOptionalPropertiesToItineraryObjectService.executeArrPassenger(itinerary.passengers)

  return response.json({ data: passengers });
})

export default passengersRouter;
