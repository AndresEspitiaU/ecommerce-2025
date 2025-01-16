import { db } from "@config/database";
import type { Category } from "@/types/category.types";
import sql from "mssql";

export const getAllCategories = async (): Promise<Category[]> => {
  const query = "SELECT * FROM Categorias WHERE Activo = 1";
  return await db.query<Category>(query);
};

export const getCategoryById = async (id: number): Promise<Category | null> => {
  const query = "SELECT * FROM Categorias WHERE CategoriaID = @id AND Activo = 1";
  const results = await db.query<Category>(query, { id });
  return results.length > 0 ? results[0] : null;
};

export const createCategory = async (category: Category): Promise<number> => {
  const query = `
    INSERT INTO Categorias (Nombre, Descripcion, Slug, FechaCreacion, FechaActualizacion, Activo)
    OUTPUT INSERTED.CategoriaID
    VALUES (@name, @description, @slug, GETDATE(), GETDATE(), 1)
  `;
  const results = await db.query<{ CategoriaID: number }>(query, {
    name: category.name,
    description: category.description,
    slug: category.slug,
  });
  return results[0].CategoriaID;
};

export const updateCategory = async (id: number, category: Partial<Category>): Promise<boolean> => {
  const checkSlugQuery = `
    SELECT COUNT(*) AS count
    FROM Categorias
    WHERE Slug = @slug AND CategoriaID != @id AND Activo = 1
  `;

  const updateQuery = `
    UPDATE Categorias
    SET Nombre = @name, Descripcion = @description, Slug = @slug, FechaActualizacion = GETDATE()
    WHERE CategoriaID = @id AND Activo = 1
  `;

  try {
    // Verificar si el Slug ya existe
    const duplicateCheck = await db.query<{ count: number }>(checkSlugQuery, {
      slug: category.slug,
      id,
    });

    if (duplicateCheck[0].count > 0) {
      throw new Error(`El Slug "${category.slug}" ya está en uso por otra categoría activa.`);
    }

    // Si no hay conflicto, procede con la actualización
    const result = await db.query(updateQuery, {
      id,
      name: category.name,
      description: category.description,
      slug: category.slug,
    });

    return result.length > 0;
  } catch (error) {
    console.error("Error en el servicio updateCategory:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Error al actualizar la categoría");
    } else {
      throw new Error("Error desconocido al actualizar la categoría");
    }
  }
};




export const deleteCategory = async (id: number): Promise<boolean> => {
  const query = "UPDATE Categorias SET Activo = 0 WHERE CategoriaID = @id";
  try {
    const pool = await db.getConnection();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    const request = transaction.request();
    request.input("id", sql.Int, id); // Asegúrate de especificar el tipo de dato

    const result = await request.query(query);
    console.log("Filas afectadas:", result.rowsAffected[0]);

    if (result.rowsAffected[0] > 0) {
      await transaction.commit(); // Confirmar los cambios
      console.log("Transacción confirmada.");
    } else {
      await transaction.rollback(); // Revertir los cambios si no se afectaron filas
      console.log("Transacción revertida.");
    }

    // Verificar el estado actual de la categoría
    const verifyQuery = "SELECT CategoriaID, Activo FROM Categorias WHERE CategoriaID = @id";
    const verifyResult = await pool.request().input("id", sql.Int, id).query(verifyQuery);
    console.log("Estado actual después del UPDATE:", verifyResult.recordset);

    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error("Error eliminando categoría:", error);
    throw new Error("Error eliminando la categoría");
  }
};
