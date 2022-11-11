import { Router } from 'express';
import { getRepository } from 'typeorm';
import ensureAdmin from '../middlewares/ensureAdmin';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UserSearching from '../models/UsersSearching';
import CalculateDistanceBetweenCoords from '../services/CalculateDistanceBetweenCoords';
import CreateUserSearchingService from '../services/User/CreateUserSearchingService';
import GetCoordinatesByAddress from '../services/GetCoordinatesByAddress';

const searchRoutes = Router();

interface userWithoutSensitiveInfo {
  id_user: string;
  name: string;
  email: string;
  avatar_image: string;
}

searchRoutes.get('/list', ensureAdmin, async (request, response) => {
  const usersSearchingRepository = getRepository(UserSearching);

  const searches = await usersSearchingRepository.find();

  // let usersWithoutSensitiveInfo: userWithoutSensitiveInfo[] = [];

  // searches.map(user => {
  //   usersWithoutSensitiveInfo.push({
  //     id_user: user.id_user,
  //     name: user.name,
  //     email: user.email,
  //     avatar_image: user.avatar_image,
  //   });
  // });

  return response.json({ data: searches });
});

searchRoutes.post('/', ensureAuthenticated, async (request, response) => {
  const { latitude_from, longitude_from, address_to } = request.body;

  const getCoordinates = new GetCoordinatesByAddress();

  const coordinates = await getCoordinates.execute({ address_to });

  const latitude_to = coordinates[0].lat;
  const longitude_to = coordinates[0].lon;

  const createUserSearching = new CreateUserSearchingService();

  const search = await createUserSearching.execute({
    id_user: request.user.id_user,
    latitude_from,
    longitude_from,
    latitude_to,
    longitude_to,
    address_to
  });

  return response.json({ data: search, message: 'Busca de usuário criada.' });
});

export default searchRoutes;

//TODO: Arrumar tipo das colunas latitude e longitude que está numeric no banco mas vem como string
searchRoutes.post('/inraio', async (request, response) => {
  const { latitude, longitude } = request.body;
  const usersSearchingRepository = getRepository(UserSearching);
  const searches = await usersSearchingRepository.find();
  var searchesFiltered;

  let lat1: number = +latitude;
  let lng1: number = +longitude;

  searchesFiltered = searches.filter(x => {
    let lat2: number = +x.latitude_from;
    let lng2: number = +x.longitude_from;
    let distance = CalculateDistanceBetweenCoords({ lat1, lng1, lat2, lng2 });
    return distance <= 2.75;
  });

  return response.json({
    allRecords: searchesFiltered,
    center: { latitude, longitude },
  });
});
