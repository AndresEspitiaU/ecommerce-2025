import { db } from '@/config/database';
import type { Talla } from '@/types/talla.types';

export const getAllTallas = async (): Promise<Talla[]> => {
  const query = 'SELECT * FROM Tallas WHERE Activo = 1 ORDER BY TalOrdenVisualizacion';
  return await db.query<Talla>(query);
};

export const getTallaById = async (id: number): Promise<Talla | null> => {
  const query = 'SELECT * FROM Tallas WHERE TallaID = @id AND Activo = 1';
  const result = await db.query<Talla>(query, { id });
  return result.length > 0 ? result[0] : null;
};

export const createTalla = async (talla: Talla): Promise<Talla> => {
  const query = `
    INSERT INTO Tallas (Nombre, Descripcion, OrdenVisualizacion, Activo)
    OUTPUT INSERTED.*
    VALUES (@Nombre, @Descripcion, @OrdenVisualizacion, @Activo)
  `;

  const result = await db.query<Talla>(query, {
    Nombre: talla.Nombre,
    Descripcion: talla.Descripcion || null,
    OrdenVisualizacion: talla.OrdenVisualizacion || null,
    Activo: talla.Activo ?? true,
  });

  return result[0];
};

export const updateTalla = async (id: number, talla: Talla): Promise<boolean> => {
  const query = `
    UPDATE Tallas
    SET TalNombre = @TalNombre, TalOrdenVisualizacion = @TalOrdenVisualizacion
    WHERE TallaID = @id AND Activo = 1
  `;
  const result = await db.query(query, {
    id,
    TalNombre: talla.Nombre,
    TalOrdenVisualizacion: talla.OrdenVisualizacion,
  });
  return result.length > 0;
};

export const deleteTalla = async (id: number): Promise<boolean> => {
  const query = `
    UPDATE Tallas
    SET Activo = 0
    WHERE TallaID = @id
  `;
  const result = await db.query(query, { id });
  return result.length > 0;
};

export const deleteTallaPermanentemente = async (id: number): Promise<boolean> => {
  const query = `
    DELETE FROM Tallas
    WHERE TallaID = @id
  `;
  const pool = await db.getConnection();
  const request = pool.request();
  request.input('id', id);
  const result = await request.query(query);
  return result.rowsAffected[0] > 0;
};
