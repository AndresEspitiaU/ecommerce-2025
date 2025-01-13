import { db } from '@/config/database';

interface Color {
  ColorID?: number;
  Nombre: string;
  CodigoHexadecimal: string;
  Activo?: boolean;
}

// Obtener todos los colores activos
export const getAllColors = async (): Promise<Color[]> => {
  const query = `SELECT * FROM Colores WHERE Activo = 1`;
  return await db.query<Color>(query);
};

// Obtener un color por ID
export const getColorById = async (id: number): Promise<Color | null> => {
  const query = `SELECT * FROM Colores WHERE ColorID = @id AND Activo = 1`;
  const result = await db.query<Color>(query, { id });
  return result.length > 0 ? result[0] : null;
};

// Crear un nuevo color
export const createColor = async (color: Color): Promise<Color> => {
  const query = `
    INSERT INTO Colores (Nombre, CodigoHexadecimal, Activo)
    OUTPUT INSERTED.*
    VALUES (@Nombre, @CodigoHexadecimal, 1)
  `;
  const result = await db.query<Color>(query, {
    Nombre: color.Nombre,
    CodigoHexadecimal: color.CodigoHexadecimal,
  });
  return result[0];
};

// Actualizar un color
export const updateColor = async (id: number, color: { Nombre: string; CodigoHexadecimal: string }): Promise<boolean> => {
    try {
      // Consulta SQL para actualizar los datos del color
      const updateQuery = `
        UPDATE Colores
        SET Nombre = @Nombre, 
            CodigoHexadecimal = @CodigoHexadecimal
        WHERE ColorID = @id AND Activo = 1
      `;
  
      // Ejecutar la consulta de actualización
      await db.query(updateQuery, {
        id,
        Nombre: color.Nombre,
        CodigoHexadecimal: color.CodigoHexadecimal,
      });
  
      // Consulta para verificar si la actualización tuvo efecto
      const verifyQuery = `
        SELECT ColorID, Nombre, CodigoHexadecimal
        FROM Colores
        WHERE ColorID = @id AND Nombre = @Nombre AND CodigoHexadecimal = @CodigoHexadecimal AND Activo = 1
      `;
  
      const verificationResult = await db.query(verifyQuery, {
        id,
        Nombre: color.Nombre,
        CodigoHexadecimal: color.CodigoHexadecimal,
      });
  
      // Si hay resultados, significa que la actualización fue exitosa
      return verificationResult.length > 0;
    } catch (error) {
      console.error('Error al actualizar el color:', error);
      throw new Error('Error al actualizar el color');
    }
  };
  

  export const deleteColor = async (id: number): Promise<boolean> => {
    try {
      // Consulta SQL para eliminar el color por ID
      const deleteQuery = `
        DELETE FROM Colores
        WHERE ColorID = @id
      `;
  
      // Ejecutar la consulta para eliminar
      await db.query(deleteQuery, { id });
  
      // Verificar si el color fue eliminado
      const verifyQuery = `
        SELECT ColorID
        FROM Colores
        WHERE ColorID = @id
      `;
      const verificationResult = await db.query(verifyQuery, { id });
  
      // Si no se encuentran resultados, el color fue eliminado correctamente
      return verificationResult.length === 0;
    } catch (error) {
      console.error('Error al eliminar el color:', error);
      throw new Error('Error al eliminar el color');
    }
  };
  
  export const deleteColorPermanentemente = async (id: number): Promise<boolean> => {
    try {
      // Consulta SQL para eliminar permanentemente el color
      const deleteQuery = `
        DELETE FROM Colores
        WHERE ColorID = @id
      `;
  
      // Ejecutar la consulta
      const result = await db.query(deleteQuery, { id });
  
      // Verificar si se eliminó (no debería haber resultados con el ID después del DELETE)
      const verificationQuery = `
        SELECT ColorID
        FROM Colores
        WHERE ColorID = @id
      `;
      const verificationResult = await db.query(verificationQuery, { id });
  
      // Si la verificación no devuelve resultados, el registro fue eliminado
      return verificationResult.length === 0;
    } catch (error) {
      console.error('Error al eliminar el color permanentemente:', error);
      throw new Error('Error al eliminar el color permanentemente');
    }
  };
  