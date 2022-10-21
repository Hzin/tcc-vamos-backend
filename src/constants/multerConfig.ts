var path = require('path');
import multer from 'multer';

export const basePath = path.join(__dirname, '..', '..', 'public')

const formatFilename = (file: Express.Multer.File): string => {
  return file.fieldname + '-' + Date.now() + path.extname(file.originalname)
}

export const vehiclesRoutesDocumentPostPath = path.join('vehicles', 'documents')
const vehiclesRoutesDocumentPostMulter = multer(
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

export default vehiclesRoutesDocumentPostMulter
