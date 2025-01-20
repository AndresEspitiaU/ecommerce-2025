import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Router, type Request, type Response, type NextFunction } from 'express';

const router = Router();

// Asegurarse de que el directorio de uploads existe
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${extension}`);
  }
});

// Filtro para tipos de archivos permitidos
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WEBP, SVG)'));
  }
};

// Límites para los archivos
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
  files: 1
};

// Configuración de multer
const upload = multer({
  storage,
  fileFilter,
  limits
});

// Middleware para manejar errores de multer
const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        error: 'El archivo excede el tamaño máximo permitido (5MB)'
      });
      return;
    }
    res.status(400).json({
      error: `Error en la carga del archivo: ${err.message}`
    });
    return;
  } 
  
  if (err) {
    res.status(400).json({
      error: err.message
    });
    return;
  }
  
  next();
};

// Ruta para la carga de archivos
router.post(
  '/upload', 
  (req: Request, res: Response, next: NextFunction) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        handleMulterError(err, req, res, next);
        return;
      }
      next();
    });
  },
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({
          error: 'No se proporcionó ningún archivo'
        });
        return;
      }

      const filePath = `/uploads/${req.file.filename}`;
      
      res.status(200).json({
        message: 'Archivo subido correctamente',
        filePath,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });

    } catch (error) {
      console.error('Error al procesar la carga del archivo:', error);
      res.status(500).json({
        error: 'Error interno del servidor al procesar el archivo'
      });
    }
  }
);

// Ruta para eliminar un archivo
router.delete(
  '/upload/:filename', 
  (req: Request, res: Response) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(uploadDir, filename);

      if (!fs.existsSync(filePath)) {
        res.status(404).json({
          error: 'El archivo no existe'
        });
        return;
      }

      fs.unlinkSync(filePath);

      res.status(200).json({
        message: 'Archivo eliminado correctamente'
      });

    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
      res.status(500).json({
        error: 'Error interno del servidor al eliminar el archivo'
      });
    }
  }
);

export default router;