import { db } from '@/config/database';

export interface Subcategoria {
  SubcategoriaID?: number;
  CategoriaID: number;
  Nombre: string;
  Descripcion?: string;
  Slug: string;
  ImagenURL?: string;
  IconoURL?: string;
  MetaTitle?: string;
  MetaDescription?: string;
  OrdenVisualizacion?: number;
  Activo?: boolean;
  CreadoPor?: string;
  FechaCreacion?: Date;
  FechaActualizacion?: Date;
}

// Obtener todas las subcategorías
export const getAllSubcategories = async (): Promise<Subcategoria[]> => {
  const query = "SELECT * FROM Subcategorias WHERE Activo = 1";
  return await db.query<Subcategoria>(query);
};

// Obtener una subcategoría por ID
export const getSubcategoryById = async (id: number): Promise<Subcategoria | null> => {
  const query = "SELECT * FROM Subcategorias WHERE SubcategoriaID = @id AND Activo = 1";
  const result = await db.query<Subcategoria>(query, { id });
  return result.length ? result[0] : null;
};

// Crear una subcategoría
export const createSubcategory = async (subcategory: Subcategoria): Promise<Subcategoria> => {
  const query = `
    INSERT INTO Subcategorias (
      CategoriaID, 
      Nombre, 
      Descripcion, 
      Slug, 
      ImagenURL, 
      IconoURL, 
      MetaTitle, 
      MetaDescription,
      OrdenVisualizacion, 
      Activo, 
      CreadoPor,
      FechaCreacion,
      FechaActualizacion
    )
    OUTPUT INSERTED.*
    VALUES (
      @CategoriaID,
      @Nombre,
      @Descripcion,
      @Slug,
      @ImagenURL,
      @IconoURL,
      @MetaTitle,
      @MetaDescription,
      @OrdenVisualizacion,
      @Activo,
      @CreadoPor,
      GETDATE(),
      GETDATE()
    )
  `;

  try {
    console.log('Datos a insertar:', subcategory);
    
    const isActivo = subcategory.Activo !== undefined ? 
      Boolean(subcategory.Activo) : true;

    const result = await db.query<Subcategoria>(query, {
      CategoriaID: subcategory.CategoriaID,
      Nombre: subcategory.Nombre,
      Descripcion: subcategory.Descripcion || '',
      Slug: subcategory.Slug,
      ImagenURL: subcategory.ImagenURL || '',
      IconoURL: subcategory.IconoURL || '',
      MetaTitle: subcategory.MetaTitle || '',
      MetaDescription: subcategory.MetaDescription || '',
      OrdenVisualizacion: subcategory.OrdenVisualizacion || 0,
      Activo: isActivo,
      CreadoPor: subcategory.CreadoPor || 'system'
    });

    if (!result || !result.length) {
      throw new Error('No se pudo crear la subcategoría');
    }

    // Asegurarse de que el resultado cumpla con la interfaz Subcategoria
    const createdSubcategory: Subcategoria = {
      SubcategoriaID: result[0].SubcategoriaID,
      CategoriaID: result[0].CategoriaID,
      Nombre: result[0].Nombre,
      Descripcion: result[0].Descripcion,
      Slug: result[0].Slug,
      ImagenURL: result[0].ImagenURL,
      IconoURL: result[0].IconoURL,
      MetaTitle: result[0].MetaTitle,
      MetaDescription: result[0].MetaDescription,
      OrdenVisualizacion: result[0].OrdenVisualizacion,
      Activo: result[0].Activo,
      CreadoPor: result[0].CreadoPor,
      FechaCreacion: result[0].FechaCreacion,
      FechaActualizacion: result[0].FechaActualizacion
    };

    return createdSubcategory;
  } catch (error) {
    console.error('Error al crear subcategoría:', error);
    throw error;
  }
};

// Actualizar una subcategoría
export const updateSubcategory = async (id: number, subcategory: Partial<Subcategoria>): Promise<boolean> => {
  try {
    const query = `
      UPDATE Subcategorias
      SET
        CategoriaID = @CategoriaID,
        Nombre = @Nombre,
        Descripcion = @Descripcion,
        Slug = @Slug,
        ImagenURL = @ImagenURL,
        IconoURL = @IconoURL,
        MetaTitle = @MetaTitle,
        MetaDescription = @MetaDescription,
        OrdenVisualizacion = @OrdenVisualizacion,
        Activo = @Activo,
        FechaActualizacion = GETDATE()
      OUTPUT INSERTED.*
      WHERE SubcategoriaID = @id
    `;

    const params = {
      id,
      CategoriaID: subcategory.CategoriaID,
      Nombre: subcategory.Nombre,
      Descripcion: subcategory.Descripcion,
      Slug: subcategory.Slug,
      ImagenURL: subcategory.ImagenURL,
      IconoURL: subcategory.IconoURL,
      MetaTitle: subcategory.MetaTitle,
      MetaDescription: subcategory.MetaDescription,
      OrdenVisualizacion: subcategory.OrdenVisualizacion,
      Activo: subcategory.Activo
    };

    const result = await db.query<Subcategoria>(query, params);
    return result.length > 0;

  } catch (error) {
    console.error('Error en updateSubcategory:', error);
    throw error;
  }
};

// subcategory.service.ts
export const deleteSubcategory = async (id: number): Promise<boolean> => {
  try {
    const checkQuery = "SELECT COUNT(*) as count FROM Subcategorias WHERE SubcategoriaID = @id";
    const exists = await db.query<{ count: number }>(checkQuery, { id });

    if (!exists[0]?.count) {
      return false; // La subcategoría no existe
    }

    const deleteQuery = "DELETE FROM Subcategorias WHERE SubcategoriaID = @id";
    await db.query(deleteQuery, { id });

    // Verificamos si la eliminación fue exitosa
    const verifyQuery = "SELECT COUNT(*) as count FROM Subcategorias WHERE SubcategoriaID = @id";
    const verification = await db.query<{ count: number }>(verifyQuery, { id });

    return verification[0]?.count === 0;

  } catch (error) {
    console.error('Error al eliminar la subcategoría:', error);
    throw new Error('Error al eliminar la subcategoría');
  }
};