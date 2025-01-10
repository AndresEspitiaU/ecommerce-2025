import sql from 'mssql';
import { config as dotenvConfig } from 'dotenv';
import path from 'path';

// Configurar dotenv para usar el archivo .env en la raíz
dotenvConfig({ path: path.resolve(__dirname, '../../.env') });

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER || '',
  port: Number(process.env.DB_PORT),
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

// Clase para manejar la conexión a la base de datos
class Database {
  private static pool: sql.ConnectionPool | null = null;

  // Obtener la conexión del pool
  public static async getConnection(): Promise<sql.ConnectionPool> {
    try {
      if (this.pool) return this.pool;
      this.pool = await sql.connect(sqlConfig);
      return this.pool;
    } catch (error) {
      console.error('Error al obtener conexión:', error);
      throw new Error('Error al conectar con la base de datos');
    }
  }

  // Método para ejecutar queries
  public static async query<T>(query: string, params?: Record<string, any>): Promise<T[]> {
    try {
      const pool = await this.getConnection();
      const request = pool.request();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          request.input(key, value);
        });
      }

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      console.error('Error en query:', error);
      throw new Error('Error al ejecutar la consulta');
    }
  }

  // Método para ejecutar stored procedures
  public static async executeProc<T>(procName: string, params?: Record<string, any>): Promise<T[]> {
    try {
      const pool = await this.getConnection();
      const request = pool.request();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          request.input(key, value);
        });
      }

      const result = await request.execute(procName);
      return result.recordset;
    } catch (error) {
      console.error('Error en stored procedure:', error);
      throw new Error('Error al ejecutar el stored procedure');
    }
  }

  // Método para transacciones
  public static async transaction<T>(callback: (transaction: sql.Transaction) => Promise<T>): Promise<T> {
    const pool = await this.getConnection();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      console.error('Error en transacción:', error);
      throw new Error('Error en la transacción');
    }
  }

  // Método para cerrar la conexión
  public static async closeConnection(): Promise<void> {
    try {
      if (this.pool) {
        await this.pool.close();
        this.pool = null;
      }
    } catch (error) {
      console.error('Error al cerrar la conexión:', error);
      throw new Error('Error al cerrar la conexión');
    }
  }
}

// Función para probar la conexión
export async function connectDB(): Promise<void> {
  try {
    await Database.getConnection();
    console.log('✅ Conexión exitosa a SQL Server');
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos:', error);
    throw error;
  }
}

export { Database as db };