import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { db, connectDB } from '@/config/database';
import authRoutes from '@/routes/auth.routes';
import { setupRolesYPermisos } from '@/config/initialSetup';
import userRoutes from '@/routes/user.routes';
import roleRoutes from '@/routes/role.routes';
import categoryRoutes from '@/routes/category.routes';

// Cargar variables de entorno desde el archivo .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Inicializar roles y permisos al arrancar la aplicación
if (process.env.NODE_ENV === 'development') {
  setupRolesYPermisos().catch(console.error);
}


// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api', roleRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/categories", categoryRoutes);

app.use(express.urlencoded({ extended: true }));

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