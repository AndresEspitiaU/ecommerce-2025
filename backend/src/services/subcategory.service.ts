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
    INSERT INTO Subcategorias (CategoriaID, Nombre, Descripcion, Slug, ImagenURL, IconoURL, MetaTitle, MetaDescription, OrdenVisualizacion, Activo)
    OUTPUT INSERTED.*
    VALUES (@CategoriaID, @Nombre, @Descripcion, @Slug, @ImagenURL, @IconoURL, @MetaTitle, @MetaDescription, @OrdenVisualizacion, 1)
  `;
  const result = await db.query<Subcategoria>(query, subcategory);
  return result[0];
};

// Actualizar una subcategoría
export const updateSubcategory = async (id: number, subcategory: Partial<Subcategoria>): Promise<boolean> => {
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
      Activo = @Activo
    WHERE SubcategoriaID = @id
  `;
  const result = await db.query(query, { id, ...subcategory });
  return result.length > 0;
};

// Eliminar (desactivar) una subcategoría
export const deleteSubcategory = async (id: number): Promise<boolean> => {
  const query = "UPDATE Subcategorias SET Activo = 0 WHERE SubcategoriaID = @id";
  try {
    // Ejecuta la consulta
    const result = await db.query(query, { id });

    // Verifica manualmente si la subcategoría se desactivó
    const verificationQuery = "SELECT Activo FROM Subcategorias WHERE SubcategoriaID = @id";
    const verificationResult = await db.query<{ Activo: boolean }>(verificationQuery, { id });

    if (verificationResult.length > 0 && verificationResult[0].Activo === false) {
      console.log(`✅ Subcategoría con ID ${id} desactivada correctamente.`);
      return true;
    } else {
      console.log(`⚠ Subcategoría con ID ${id} no se desactivó.`);
      return false;
    }
  } catch (error) {
    console.error('Error al eliminar la subcategoría:', error);
    throw new Error('Error al eliminar la subcategoría');
  }
};

