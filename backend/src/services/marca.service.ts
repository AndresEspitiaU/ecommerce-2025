import { db } from '@/config/database';

interface Marca {
  MarcaID?: number;
  Nombre: string;
  Descripcion?: string;
  Logo?: string;
  Slug: string;
  FechaCreacion?: Date;
  Activo?: boolean;
}

// Obtener todas las marcas activas
export const getAllMarcas = async (): Promise<Marca[]> => {
  const query = "SELECT * FROM Marcas WHERE Activo = 1";
  return await db.query<Marca>(query);
};

// Obtener una marca por ID
export const getMarcaById = async (id: number): Promise<Marca | null> => {
  const query = "SELECT * FROM Marcas WHERE MarcaID = @id AND Activo = 1";
  const result = await db.query<Marca>(query, { id });
  return result.length > 0 ? result[0] : null;
};

// Crear una nueva marca
export const createMarca = async (marca: Marca): Promise<Marca> => {
  const query = `
    INSERT INTO Marcas (Nombre, Descripcion, Logo, Slug, Activo)
    OUTPUT INSERTED.*
    VALUES (@Nombre, @Descripcion, @Logo, @Slug, 1)
  `;
  const result = await db.query<Marca>(query, {
    Nombre: marca.Nombre,
    Descripcion: marca.Descripcion || null,
    Logo: marca.Logo || null,
    Slug: marca.Slug,
  });
  return result[0];
};

// Actualizar una marca
export const updateMarca = async (id: number, marca: Marca): Promise<boolean> => {
  try {
    const pool = await db.getConnection();
    const request = pool.request();

    // Configurar los parámetros de la consulta
    request.input('id', id);
    request.input('Nombre', marca.Nombre);
    request.input('Descripcion', marca.Descripcion || null);
    request.input('Logo', marca.Logo || null);
    request.input('Slug', marca.Slug);

    const query = `
      UPDATE Marcas
      SET Nombre = @Nombre, Descripcion = @Descripcion, Logo = @Logo, Slug = @Slug
      WHERE MarcaID = @id AND Activo = 1
    `;

    const result = await request.query(query);

    // Verificar filas afectadas
    const affectedRows = result.rowsAffected[0] || 0;
    return affectedRows > 0;
  } catch (error) {
    console.error('Error al actualizar la marca:', error);
    throw new Error('Error al actualizar la marca');
  }
};




// Eliminar (desactivar) una marca
export const deleteMarca = async (id: number): Promise<boolean> => {
  try {
    const query = `
      UPDATE Marcas
      SET Activo = 0
      WHERE MarcaID = @id
    `;

    const pool = await db.getConnection();
    const request = pool.request();
    request.input('id', id);

    const result = await request.query(query);

    // Registrar filas afectadas
    console.log(`Filas afectadas: ${result.rowsAffected[0]}`);

    // Verificar el estado actual de la marca
    const verificationQuery = `
      SELECT Activo
      FROM Marcas
      WHERE MarcaID = @id
    `;
    const verificationResult = await request.query(verificationQuery);

    console.log('Estado actual después del UPDATE:', verificationResult.recordset);

    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error('Error al eliminar la marca:', error);
    throw error;
  }
};

// Eliminar permanentemente una marca
export const deleteMarcaPermanentemente = async (id: number): Promise<boolean> => {
  try {
    const query = `
      DELETE FROM Marcas
      WHERE MarcaID = @id
    `;

    const pool = await db.getConnection();
    const request = pool.request();
    request.input('id', id);

    const result = await request.query(query);

    // Verifica las filas afectadas
    console.log(`Filas afectadas: ${result.rowsAffected[0]}`);
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error('Error al eliminar la marca permanentemente:', error);
    throw new Error('Error al eliminar la marca permanentemente');
  }
};
