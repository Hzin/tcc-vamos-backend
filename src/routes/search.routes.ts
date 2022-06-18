import { Router } from 'express';
import { getRepository } from 'typeorm';
import UserSearching from '../models/UsersSearching';
import CreateUserSearchingService from '../services/CreateUserSearchingService';
import GetCoordinatesByAddress from '../services/GetCoordinatesByAddress';

const searchRoutes = Router();

interface userWithoutSensitiveInfo {
  id_user: string;
  name: string;
  email: string;
  avatar_image: string;
}

searchRoutes.get('/list', async (request, response) => {
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

searchRoutes.post('/', async (request, response) => {
  const { id_user, latitude_from, longitude_from, address_to } = request.body;

  const getCoordinates = new GetCoordinatesByAddress();

  const coordinates = await getCoordinates.execute({address_to})

  const latitude_to = coordinates.lat;
  const longitude_to = coordinates.lon;

  const createUserSearching = new CreateUserSearchingService();

  const search = await createUserSearching.execute({
    id_user,
    latitude_from,
    longitude_from,
    latitude_to,
    longitude_to
  });

  return response.json({ message: 'Busca de usuário criada.' });
});

export default searchRoutes;

//TODO: Arrumar calculo da busca no raio
//TODO: Arrumar tipo das colunas latitude e longitude que está numeric no banco mas vem como string
searchRoutes.post('/inraio', async (request, response) => {
  const { latitude, longitude } = request.body;
  const usersSearchingRepository = getRepository(UserSearching);
  console.log(request.body)
  const searches = await usersSearchingRepository.find();
  var searchesFiltered;
  for(let i in searches){
    searchesFiltered = searches.filter(x =>{
      let distance = (6371 * Math.acos(
        Math.cos(Math.atan(latitude)) *
        Math.cos(Math.atan(x.latitude_from)) *
        Math.cos(Math.atan(longitude) - Math.atan(x.longitude_from)) +
        Math.sin(Math.atan(latitude)) *
        Math.sin(Math.atan(x.latitude_from))
      ))
      // console.log(distance)
      return distance <= 0.1
    })
  }
  // console.log(searches)
  return response.json({ allRecords: searchesFiltered, center:{latitude, longitude} });
});