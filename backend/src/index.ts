import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { db, connectDB } from '@/config/database';
import authRoutes from '@/routes/auth.routes';
import { setupRolesYPermisos } from '@/config/initialSetup';
import userRoutes from '@/routes/user.routes';
import roleRoutes from '@/routes/role.routes';
import categoryRoutes from '@/routes/category.routes';
import subcategoryRoutes from '@/routes/subcategory.routes';
import marcaRoutes from '@/routes/marca.routes';
import colorRoutes from '@/routes/color.routes';
import cuponRoutes from '@/routes/cupon.routes';
import tallaRoutes from '@/routes/talla.routes';
import permissionsRoutes from './routes/permissions.routes';
import uploadRoutes from './routes/upload.routes';

// Cargar variables de entorno desde el archivo .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Asegurarse de que existe el directorio de uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de CORS más detallada
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 horas
};



// Inicializar roles y permisos al arrancar la aplicación
if (process.env.NODE_ENV === 'development') {
  setupRolesYPermisos().catch(console.error);
}

app.use(
  cors({
    origin: ['http://localhost:4200'], // Cambia esto según tu dominio en producción
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);



// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api', roleRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/categories", categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/marcas', marcaRoutes);
app.use('/api/colores', colorRoutes);
app.use('/api/cupones', cuponRoutes);
app.use('/api/tallas', tallaRoutes);
app.use('/api/permissions', permissionsRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware para manejar errores 404
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'La ruta solicitada no existe'
  });
});

// Middleware para manejar errores generales
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ha ocurrido un error en el servidor'
  });
});

// Ruta simple para verificar que el servidor funciona
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor funcionando correctamente'
  });
});

// Ruta para probar específicamente la conexión a la base de datos
app.get('/api/test-db', async (_req, res) => {
  try {
    // Intentamos hacer una consulta simple
    const result = await db.query<{ version: string }>('SELECT @@version as version');

    res.json({
      success: true,
      message: 'Conexión a base de datos exitosa',
      sqlVersion: result[0]?.version, // Aquí está el cambio
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al conectar con la base de datos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Puerto e inicio del servidor
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Intentamos conectar a la base de datos
    await connectDB();

    // Si la conexión es exitosa, iniciamos el servidor
    app.listen(PORT, () => {
      console.log(`Conectando a la base de datos: ${process.env.DB_NAME}`);
      console.log('\n=================================');
      console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
      console.log(`📝 Verificar servidor: http://localhost:${PORT}/api/health`);
      console.log(`🔍 Verificar BD: http://localhost:${PORT}/api/test-db`);
      console.log('=================================\n');
    });

  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;