import { getRepository } from 'typeorm';

import AppError from '../../errors/AppError';

import CarModels from '../../models/CarModels';

class GetCarModelsService {
  public async execute(): Promise<CarModels[]> {
    const carModelsRepository = getRepository(CarModels);

    const carModels = await carModelsRepository.find();

    if (!carModels) {
      // carModels, fazer no front um tratamento para isso
      throw new AppError('Não há modelos de carro cadastrados.');
    };

    return carModels;
  }
}

export default GetCarModelsService;
