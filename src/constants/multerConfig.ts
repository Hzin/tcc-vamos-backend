var path = require('path');
import multer from 'multer';

export const basePath = path.join(__dirname, '..', '..', 'public')

export const defaultVehiclePictureFilename = 'default.png'
export const defaultVehiclePicturePath = path.join('vehicles', 'pictures', 'default', defaultVehiclePictureFilename)

export const vehiclesRoutesPicturesPostPath = path.join('vehicles', 'pictures')

// TODO, fazer
// export const defaultUserPicturePath = path.join('vehicles', 'pictures', 'default')

const formatFilename = (file: Express.Multer.File): string => {
  return file.fieldname + '-' + Date.now() + path.extname(file.originalname)
}

export const vehiclesRoutesDocumentPostPath = path.join('vehicles', 'documents')
export const vehiclesRoutesDocumentPostMulter = multer(
  {
    dest: path.join(basePath, vehiclesRoutesDocumentPostPath),
    limits: {
      fileSize: 20000000, // 20 MB
      files: 1,
    },
    // storage: multer.diskStorage({
    //   filename: function (req, file, cb) {
    //     cb(null, formatFilename(file));
    //   },
    // destination: vehiclesRoutesDocumentPostPath,
    // })
  }
)

export const vehiclesUploadPicturePath = path.join('vehicles', 'pictures')
export const vehiclesUploadPictureMulter = multer(
  {
    dest: path.join(basePath, vehiclesUploadPicturePath),
    limits: {
      fileSize: 20000000, // 20 MB
      files: 1,
    }
  }
)
