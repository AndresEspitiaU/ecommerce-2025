import type { Request, Response } from 'express';
import * as SubcategoryService from '@/services/subcategory.service';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const subcategories = await SubcategoryService.getAllSubcategories();
    res.status(200).json(subcategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener subcategorías' });
  }
};

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

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const newSubcategory = await SubcategoryService.createSubcategory(req.body);
    res.status(201).json(newSubcategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la subcategoría" });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await SubcategoryService.updateSubcategory(Number(id), req.body);
    if (!updated) {
      res.status(404).json({ error: "Subcategoría no encontrada" });
      return;
    }
    res.status(200).json({ message: "Subcategoría actualizada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la subcategoría" });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await SubcategoryService.deleteSubcategory(Number(id));
    if (!deleted) {
      res.status(404).json({ error: "Subcategoría no encontrada" });
      return;
    }
    res.status(200).json({ message: "Subcategoría eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la subcategoría" });
  }
};
