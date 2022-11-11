import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ensureAdmin from '../middlewares/ensureAdmin';

import AppError from '../errors/AppError';

import { vehiclesRoutesDocumentPostMulter, vehiclesUploadPictureMulter } from '../constants/multerConfig';

import FindVehicleService from '../services/Vehicle/FindVehicleService';
import CreateVehicleService from '../services/Vehicle/CreateVehicleService';
import UpdateVehicleService from '../services/Vehicle/UpdateVehicleService';
import UpdateVehiclePlateService from '../services/Vehicle/UpdateVehiclePlateService';
import FindVehicleByUserIdService from '../services/Vehicle/FindVehiclesByUserIdService';
import UploadVehicleDocumentFileService from '../services/Vehicle/UploadVehicleDocumentFileService';
import DeleteVehicleDocumentFileService from '../services/Vehicle/DeleteVehicleDocumentFileService';
import FindVehicleDocumentsByDocumentTypeService from '../services/Vehicle/FindVehicleDocumentsByDocumentTypeService';
import UpdateVehicleDocumentStatusService from '../services/Vehicle/UpdateVehicleDocumentStatusService';
import UploadVehiclePictureFileService from '../services/Vehicle/UploadVehiclePictureFileService';
import DeleteVehiclePictureFileService from '../services/Vehicle/DeleteVehiclePictureFileService';
import GetVehiclesWithPendingDocuments from '../services/Vehicle/GetVehiclesWithPendingDocuments';
import FindVehiclesService from '../services/Vehicle/FindVehiclesService';
import DeleteVehicleService from '../services/Vehicle/DeleteVehicleService';
import CheckIfVehicleCanCreateItineraries from '../services/Vehicle/CheckIfVehicleCanCreateItineraries';
import CountVehiclesPendingDocuments from '../services/Vehicle/CountVehiclesPendingDocuments';

const vehiclesRouter = Router();

vehiclesRouter.get('/list', async (request, response) => {
  const findVehiclesService = new FindVehiclesService();
  const vehicles = await findVehiclesService.execute();

  return response.json({ data: vehicles });
});

vehiclesRouter.get(
  '/plate/:plate',
  ensureAuthenticated,
  async (request, response) => {
    const { plate } = request.params;

    const findVehicleService = new FindVehicleService();
    const vehicle = await findVehicleService.execute(plate);

    return response.json({ data: vehicle });
  },
);

vehiclesRouter.get(
  '/user/:id_user',
  async (request, response) => {
    const { id_user } = request.params;

    const findVehicleByUserIdService = new FindVehicleByUserIdService();
    const vehicles = await findVehicleByUserIdService.execute(id_user);

    return response.json({ data: vehicles });
  },
);

vehiclesRouter.post('/', ensureAuthenticated, async (request, response) => {
  const {
    plate,
    brand,
    model,
    seats_number,
    locator_name,
    locator_address,
    locator_complement,
    locator_city,
    locator_state,
  } = request.body;

  const createVehicleService = new CreateVehicleService();

  const vehicle = await createVehicleService.execute({
    id_user: request.user.id_user,
    plate,
    brand,
    model,
    seats_number,
    locator_name,
    locator_address,
    locator_complement,
    locator_city,
    locator_state,
  });

  return response.json({ message: 'Veículo criado com sucesso.', data: vehicle });
});

vehiclesRouter.patch(
  '/edit/:plate',
  ensureAuthenticated,
  async (request, response) => {
    const {
      brand,
      model,
      seats_number,
      locator_name,
      locator_address,
      locator_complement,
      locator_city,
      locator_state,
    } = request.body;

    const { plate } = request.params;

    const updateVehicleService = new UpdateVehicleService();

    await updateVehicleService.execute({
      plate,
      brand,
      model,
      seats_number,
      locator_name,
      locator_address,
      locator_complement,
      locator_city,
      locator_state,
    });

    return response.json({
      message: 'Informações da vehicle atualizadas com sucesso.',
    });
  },
);

vehiclesRouter.patch(
  '/edit/plate/:plate',
  ensureAuthenticated,
  async (request, response) => {
    const { newPlate } = request.body;

    const { plate } = request.params;

    const updateVehiclePlateService = new UpdateVehiclePlateService();

    await updateVehiclePlateService.execute({
      oldPlate: plate,
      newPlate,
    });

    return response.json({
      message: 'Placa da vehicle atualizada com sucesso.',
    });
  },
);

vehiclesRouter.delete(
  '/:plate',
  ensureAuthenticated,
  async (request, response) => {
    const { plate } = request.params;

    const deleteVehicleService = new DeleteVehicleService();

    await deleteVehicleService.execute(plate);

    return response.json({
      message: 'Veículo deletado com sucesso.',
    });
  },
);

vehiclesRouter.post('/document/search', ensureAuthenticated, async (request, response) => {
  const { vehicle_plate, document_type } = request.body

  const findVehicleDocumentsByDocumentTypeService = new FindVehicleDocumentsByDocumentTypeService();

  const vehicleDocument = await findVehicleDocumentsByDocumentTypeService.execute(
    vehicle_plate,
    ("" + document_type).toUpperCase(),
  );

  // const vehicleDocumentPath = `${vehiclesRoutesDocumentPostPath}/${vehicleDocument.path}`

  return response.json({
    path: vehicleDocument.path,
    status: vehicleDocument.status
  });
})

vehiclesRouter.patch('/document/status', ensureAdmin, async (request, response) => {
  const { vehicle_plate, document_type, status } = request.body;

  const updateVehicleDocumentStatusService = new UpdateVehicleDocumentStatusService();

  await updateVehicleDocumentStatusService.execute({
    vehicle_plate, document_type: ("" + document_type).toUpperCase(), status
  });

  return response.json({ message: 'Status do documento do veículo atualizado com sucesso!' });
});

const uploadDocument = vehiclesRoutesDocumentPostMulter
vehiclesRouter.post('/document/upload', ensureAuthenticated, uploadDocument.single('file'), async (request, response) => {
  const { vehicle_plate, document_type } = request.body

  if (!request.file) {
    throw new AppError("Arquivo não foi informado")
  }

  const uploadVehicleDocumentFileService = new UploadVehicleDocumentFileService();
  await uploadVehicleDocumentFileService.execute({
    vehicle_plate,
    document_type: ("" + document_type).toUpperCase(),
    fileName: request.file.filename,
    originalFileName: request.file.originalname
  });

  return response.json({
    message: 'Documento enviado com sucesso.',
  });
})

vehiclesRouter.patch('/document/delete', ensureAuthenticated, async (request, response) => {
  const { vehicle_plate, document_type } = request.body

  const deleteVehicleDocumentFileService = new DeleteVehicleDocumentFileService();

  await deleteVehicleDocumentFileService.execute({
    vehicle_plate,
    document_type: ("" + document_type).toUpperCase(),
  });

  return response.json({
    message: 'Documento deletado com sucesso.',
  });
})

vehiclesRouter.get(
  '/can_create_itineraries/:plate',
  ensureAuthenticated,
  async (request, response) => {
    const { plate } = request.params;

    const checkIfVehicleCanCreateItineraries = new CheckIfVehicleCanCreateItineraries();
    const result = await checkIfVehicleCanCreateItineraries.execute({ vehicle_plate: plate });

    let message = 'O seu veículo não pode criar itinerários.'
    if (result) message = 'O seu veículo pode criar itinerários!'

    return response.json({
      message: message,
      data: result,
    });
  },
);

const uploadPicture = vehiclesUploadPictureMulter
vehiclesRouter.patch('/picture/update', ensureAuthenticated, uploadPicture.single('file'), async (request, response) => {
  const { vehicle_plate } = request.body

  if (!request.file) {
    throw new AppError("Arquivo não foi informado")
  }

  const uploadVehiclePictureFileService = new UploadVehiclePictureFileService();
  const picturePath = await uploadVehiclePictureFileService.execute({
    vehicle_plate,
    fileName: request.file.filename,
    originalFileName: request.file.originalname
  });

  return response.json({
    message: "Foto do veículo atualizada com sucesso",
    data: picturePath
  })
})

vehiclesRouter.patch('/picture/delete', ensureAuthenticated, async (request, response) => {
  const { vehicle_plate } = request.body

  const deleteVehiclePictureFileService = new DeleteVehiclePictureFileService();
  const defaultPicture = await deleteVehiclePictureFileService.execute({
    vehicle_plate,
  });

  return response.json({
    message: "Foto do veículo deletada com sucesso",
    data: defaultPicture
  })
})

vehiclesRouter.get('/documents/pending', ensureAdmin, async (request, response) => {
  const getVehiclesWithPendingDocuments = new GetVehiclesWithPendingDocuments();
  const documents = await getVehiclesWithPendingDocuments.execute();

  return response.json({
    data: documents
  })
})

vehiclesRouter.get('/documents/pending/count', ensureAdmin, async (request, response) => {
  const countVehiclesPendingDocuments = new CountVehiclesPendingDocuments()
  const pendingVehiclesDocumentsCount = await countVehiclesPendingDocuments.execute();

  return response.json({ data: pendingVehiclesDocumentsCount });
})

export default vehiclesRouter;
