import { Router } from 'express';
import { getRepository } from 'typeorm';
import CalculateDistanceBetweenCoords from '../services/CalculateDistanceBetweenCoords';

const transportesRouter = Router();

transportesRouter.post('/', async (request, response) => {
  const { coordinatesFrom, coordinatesTo } = request.body;
  console.log(coordinatesFrom, coordinatesTo);
  const data = [
    {
      motorista: 'João',
      valor: 'R$ 150,00',
      lugares: '2',
      avaliacao: '4.5',
      bairros_atendidos: [{lat:-22.873432, lgn:-47.142274}],
      destinos: [{lat:-22.833645, lgn:-47.048905}],
    },
    {
      motorista: 'Ricardo',
      valor: 'R$ 180,00',
      lugares: '5',
      avaliacao: '4.0',
      bairros_atendidos: [{lat:-22.873432, lgn:-47.142274}],
      destinos: [{lat:-22.833645, lgn:-47.048905}],
    },
    {
      motorista: 'Luiz',
      valor: 'R$ 200,00',
      lugares: '1',
      avaliacao: '4.3',
      bairros_atendidos: [{lat:-22.873432, lgn:-47.142274}],
      destinos: [{lat:-22.833645, lgn:-47.048905}],
    },
    {
      motorista: 'Marcos',
      valor: 'R$ 199,00',
      lugares: '6',
      avaliacao: '4.9',
      bairros_atendidos: [{lat:-22.873432, lgn:-47.142274}],
      destinos: [{lat:-22.833645, lgn:-47.048905}],
    },
    {
      motorista: 'Orandi',
      valor: 'R$ 210,00',
      lugares: '8',
      avaliacao: '5.0',
      bairros_atendidos: [{lat:-22.873432, lgn:-47.142274}],
      destinos: [{lat:-22.833645, lgn:-47.048905}],
    },
    {
      motorista: 'Pedro',
      valor: 'R$ 189,00',
      lugares: '4',
      avaliacao: '4.1',
      bairros_atendidos: [{lat:-22.873432, lgn:-47.142274}],
      destinos: [{lat:-22.833645, lgn:-47.048905}],
    },
    {
      motorista: 'Pericles',
      valor: 'R$ 220,00',
      lugares: '19',
      avaliacao: '4.5',
      bairros_atendidos: [{lat:-23.873432, lgn:-47.142274}],
      destinos: [{lat:-22.833645, lgn:-47.048905}],
    },
  ];

  let lat_from:number = +coordinatesFrom.lat;
  let lng_from:number = +coordinatesFrom.lng;
  let lat_to:number = +coordinatesTo.lat;
  let lng_to:number = +coordinatesTo.lng;

  let transportsFiltered = data.filter(x => {
    var distance = 0;
    var distance2 = 0;
    for (const i of x.bairros_atendidos) {
      let lat2:number = +i.lat;
      let lng2:number = +i.lgn;
      distance = CalculateDistanceBetweenCoords({lat1:lat_from, lng1:lng_from, lat2, lng2});
      if (distance <= 10) break;
    }
    
    for (const j of x.destinos) {
      let lat2:number = +j.lat;
      let lng2:number = +j.lgn;
      distance2 = CalculateDistanceBetweenCoords({lat1:lat_to, lng1:lng_to, lat2, lng2});
      if (distance2 <= 10) break;
    }

    return (distance <= 10 && distance2 <= 10);
  });

  console.log(transportsFiltered)
  return response.json(transportsFiltered);
});

export default transportesRouter;
