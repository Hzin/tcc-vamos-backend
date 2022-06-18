import axios from 'axios';
import AppError from '../errors/AppError';

interface Request {
  latitude: string;
  longitude: string;
}

class GetAddressByCoordinates {
  public async execute({ latitude, longitude }: Request): Promise<JSON> {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
    
    if (!response.data) {
      throw new AppError('Não foi possível encontrar o endereço para a coordenada informada!', 200);
    }
    return response.data;
  }
}

export default GetAddressByCoordinates;
