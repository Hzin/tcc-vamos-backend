import axios from 'axios';
import AppError from '../errors/AppError';

interface Request {
  address_to: string;
}

class GetCoordinatesByAddress{
  public async execute({ address_to }: Request): Promise<any> {
    // let endereco = address_to.replace(/[^a-z0-9+ ]/gi,'')
    let endereco = address_to.replace(/[^a-z0-9+áàâãéèêíïóôõöúçñ ]/gi,'')
    console.log(endereco)
    endereco = endereco.replace(/ /gi,'+')
    endereco = endereco.replace(/\+\+/g, '+')

    // console.log(endereco)
    const response = await axios.get(`https://nominatim.openstreetmap.org/?addressdetails=1&q=${endereco}&format=json&limit=1`)
    if (!response.data || !response.data.length) {
      throw new AppError('Não foi possível encontrar coordenadas para o endereço informado!', 400);
    }
    console.log(response.data)
    return response.data;
  }
}
// class GetCoordinatesByAddress{
//   public async execute({ address_to }: Request): Promise<any> {
// // let endereco = address_to.replace(/[^a-z0-9+ ]/gi,'')
//     let endereco = address_to.replace(/[^a-z0-9+áàâãéèêíïóôõöúçñ ]/gi,'')
//     // console.log(endereco)
//     endereco = endereco.replace(/ /gi,'+')
//     endereco = endereco.replace(/\+\+/g, '+')
//     // console.log(endereco)
//     const querystring = require('querystring');
//     const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${querystring.stringify(endereco)}key=`)
//     console.log(response.data)
//     if (!response.data || !response.data.length) {
//       throw new AppError('Não foi possível encontrar coordenadas para o endereço informado!', 400);
//     }
    
//     return response.data;
//   }
// }

export default GetCoordinatesByAddress;
