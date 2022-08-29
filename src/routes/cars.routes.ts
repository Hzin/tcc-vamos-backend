import { Router } from 'express';
import axios from 'axios'

import AppError from '../errors/AppError';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import GetCarModelsService from '../services/GetCarModelsService';

const carsRouter = Router();

type Brand = {
  codigo: string;
  nome: string;
};

type GetBrandsResponse = {
  data: Brand[];
};

type Model = {
  modelos: {
    codigo: string;
    nome: string;
  }
};

type GetModelsResponse = {
  modelos: Model[];
};

carsRouter.get('/brands/list', async (request, response) => {
  // const getCarModelsService = new GetCarModelsService();
  // const carModels = await getCarModelsService.execute();

  const { data, status } = await axios.get<GetBrandsResponse>(
    'https://parallelum.com.br/fipe/api/v1/carros/marcas',
    {
      headers: {
        Accept: 'application/json',
      },
    },
  );

  if (status !== 200) {
    throw new AppError('Não foi possível recuperar a lista de marcas de veículos.', 200);
  }

  return response.json({ data: data });
});

carsRouter.get('/models/list/:id', async (request, response) => {
  const { id } = request.params;

  const { data, status } = await axios.get<GetModelsResponse>(
    `https://parallelum.com.br/fipe/api/v1/carros/marcas/${id}/modelos`,
    {
      headers: {
        Accept: 'application/json',
      },
    },
  );

  if (status !== 200) {
    throw new AppError('Não foi possível recuperar a lista de modelos do veículo informado.', 200);
  }

  return response.json({ data: data.modelos });
});

export default carsRouter;
