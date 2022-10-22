import { Router } from 'express';
import { getRepository } from 'typeorm';

import Vehicle from '../models/Vehicle';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import FindVehicleService from '../services/FindVehicleService';
import CreateVehicleService from '../services/CreateVehicleService';
import UpdateVehicleService from '../services/UpdateVehicleService';
import UpdateVehiclePlateService from '../services/UpdateVehiclePlateService';
import FindVehicleByUserIdService from '../services/FindVehiclesByUserIdService';

import { vehiclesRoutesDocumentPostMulter, vehiclesRoutesDocumentPostPath, vehiclesUploadPictureMulter } from '../constants/multerConfig';
import UploadVehicleDocumentFileService from '../services/UploadVehicleDocumentFileService';
import AppError from '../errors/AppError';
import DeleteVehicleDocumentFileService from '../services/DeleteVehicleDocumentFileService';
import FindVehicleDocumentsByDocumentTypeService from '../services/FindVehicleDocumentsByDocumentTypeService';
import UpdateVehicleDocumentStatusService from '../services/UpdateVehicleDocumentStatusService';
import UploadVehiclePictureFileService from '../services/UploadVehiclePictureFileService';
import DeleteVehiclePictureFileService from '../services/DeleteVehiclePictureFileService';
import { defaultPictureVehicle } from '../constants/defaultPictures';

const vehiclesRouter = Router();

vehiclesRouter.get('/list', async (request, response) => {
  const vehiclesRepository = getRepository(Vehicle);

  const vehicles = await vehiclesRepository.find();

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

vehiclesRouter.post('/document/search', ensureAuthenticated, async (request, response) => {
  const { vehicle_plate, document_type } = request.body

  const findVehicleDocumentsByDocumentTypeService = new FindVehicleDocumentsByDocumentTypeService();

  const vehicleDocument = await findVehicleDocumentsByDocumentTypeService.execute(
    vehicle_plate,
    document_type,
  );

  const vehicleDocumentPath = `${vehiclesRoutesDocumentPostPath}/${vehicleDocument.path}`

  return response.json({
    path: vehicleDocumentPath,
    status: vehicleDocument.status
  });
})

vehiclesRouter.patch('/document/status', ensureAuthenticated, async (request, response) => {
  const { vehicle_plate, document_type, status } = request.body;

  const updateVehicleDocumentStatusService = new UpdateVehicleDocumentStatusService();
  await updateVehicleDocumentStatusService.execute({
    vehicle_plate, document_type, status
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
    document_type,
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
    document_type,
  });

  return response.json({
    message: 'Documento deletado com sucesso.',
  });
})

const uploadPicture = vehiclesUploadPictureMulter
vehiclesRouter.patch('/picture/update', ensureAuthenticated, uploadPicture.single('file'), async (request, response) => {
  const { vehicle_plate } = request.body

  if (!request.file) {
    throw new AppError("Arquivo não foi informado")
  }

  const uploadVehiclePictureFileServiceuploadVehicleDocumentFileService = new UploadVehiclePictureFileService();
  const vehicle = await uploadVehiclePictureFileServiceuploadVehicleDocumentFileService.execute({
    vehicle_plate,
    fileName: request.file.filename,
    originalFileName: request.file.originalname
  });

  return response.json({
    message: "Foto do veículo atualizada com sucesso",
    data: vehicle.picture
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

export default vehiclesRouter;
