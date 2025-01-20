import type { Request, Response } from 'express';
import * as SubcategoryService from '@/services/subcategory.service';
import { db } from '@/config/database';

// Método para obtener todas las subcategorías
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const subcategories = await SubcategoryService.getAllSubcategories();
    res.status(200).json(subcategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener subcategorías' });
  }
};

// Método para obtener una subcategoría por su ID
export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const subcategory = await SubcategoryService.getSubcategoryById(Number(id));
    if (!subcategory) {
      res.status(404).json({ error: 'Subcategoría no encontrada' });
      return;
    }
    res.status(200).json(subcategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la subcategoría' });
  }
};

// Método para crear una subcategoría
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
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
      CreadoPor
    } = req.body;

    // Log para debugging
    console.log('Datos recibidos en el controlador:', req.body);

    // Validación de campos requeridos
    if (!CategoriaID || !Nombre || !Slug) {
      res.status(400).json({
        error: 'Faltan campos requeridos',
        details: {
          CategoriaID: !CategoriaID ? 'Requerido' : null,
          Nombre: !Nombre ? 'Requerido' : null,
          Slug: !Slug ? 'Requerido' : null
        }
      });
      return;
    }

    const newSubcategory = await SubcategoryService.createSubcategory({
      CategoriaID: Number(CategoriaID),
      Nombre,
      Descripcion: Descripcion || '',
      Slug,
      ImagenURL: ImagenURL || '',
      IconoURL: IconoURL || '',
      MetaTitle: MetaTitle || '',
      MetaDescription: MetaDescription || '',
      OrdenVisualizacion: OrdenVisualizacion ? Number(OrdenVisualizacion) : 0,
      Activo: Activo === true || Activo === 'true',
      CreadoPor: CreadoPor || 'system',
      FechaCreacion: new Date(),
      FechaActualizacion: new Date()
    });

    console.log('Subcategoría creada:', newSubcategory);
    res.status(201).json(newSubcategory);

  } catch (error) {
    console.error('Error al crear subcategoría:', error);
    res.status(500).json({
      error: 'Error al crear la subcategoría',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};


// Método para actualizar una subcategoría
// subcategory.controller.ts
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    // Verificar que el Slug no esté duplicado (excepto para el mismo registro)
    const checkSlugQuery = `
      SELECT COUNT(*) as count 
      FROM Subcategorias 
      WHERE Slug = @slug 
      AND SubcategoriaID != @id
    `;

    const slugCheck = await db.query<{ count: number }>(checkSlugQuery, { 
      slug: req.body.Slug,
      id: id 
    });

    if (slugCheck[0]?.count > 0) {
      res.status(400).json({
        error: 'El slug ya está en uso por otra subcategoría',
        field: 'Slug'
      });
      return;
    }

    const updateQuery = `
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

    const result = await db.query(updateQuery, {
      id,
      CategoriaID: Number(req.body.CategoriaID),
      Nombre: req.body.Nombre,
      Descripcion: req.body.Descripcion || '',
      Slug: req.body.Slug,
      ImagenURL: req.body.ImagenURL || '',
      IconoURL: req.body.IconoURL || '',
      MetaTitle: req.body.MetaTitle || '',
      MetaDescription: req.body.MetaDescription || '',
      OrdenVisualizacion: req.body.OrdenVisualizacion ? Number(req.body.OrdenVisualizacion) : 0,
      Activo: req.body.Activo === true || req.body.Activo === 'true'
    });

    if (!result || result.length === 0) {
      res.status(404).json({ error: 'Subcategoría no encontrada' });
      return;
    }

    res.status(200).json({ 
      message: 'Subcategoría actualizada correctamente',
      data: result[0]
    });

  } catch (error) {
    console.error('Error al actualizar subcategoría:', error);
    res.status(500).json({
      error: 'Error al actualizar la subcategoría',
      details: error instanceof Error ? error.message : 'Error interno del servidor'
    });
  }
};


// Método para eliminar una subcategoría
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    console.log(`Intentando eliminar la subcategoría con ID: ${id}`);

    const success = await SubcategoryService.deleteSubcategory(id);

    if (!success) {
      res.status(404).json({ 
        error: 'Subcategoría no encontrada o ya eliminada' 
      });
      return;
    }

    res.status(200).json({ 
      message: 'Subcategoría eliminada correctamente' 
    });

  } catch (error) {
    console.error('Error al eliminar la subcategoría:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Error interno del servidor'
    });
  }
};

