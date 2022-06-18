import { Router } from 'express';
import { getRepository } from 'typeorm';

const transportesRouter = Router();

transportesRouter.get('/', async (request, response) => {
  const data = [{
    "motorista": "João",
    "valor": "R$ 10,00",
    "lugares": "2",
    "avaliacao": "4.5",
  },{
    "motorista": "Ricardo",
    "valor": "R$ 13,00",
    "lugares": "5",
    "avaliacao": "4.0",
  },{
    "motorista": "Luiz",
    "valor": "R$ 12,00",
    "lugares": "1",
    "avaliacao": "4.3",
  },{
    "motorista": "Marcos",
    "valor": "R$ 15,00",
    "lugares": "6",
    "avaliacao": "4.9",
  },{
    "motorista": "Orandi",
    "valor": "R$ 20,00",
    "lugares": "8",
    "avaliacao": "5.0",
  },{
    "motorista": "Pedro",
    "valor": "R$ 18,00",
    "lugares": "4",
    "avaliacao": "4.1",
  },{
    "motorista": "Pericles",
    "valor": "R$ 22,00",
    "lugares": "19",
    "avaliacao": "4.5",
  },
  ]

  return response.json( data );
});

export default transportesRouter;
