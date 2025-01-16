import type { Request, Response } from "express";
import * as CategoryService from "@/services/category.service";

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve categories" });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const category = await CategoryService.getCategoryById(id);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve category" });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, slug } = req.body;
    const id = await CategoryService.createCategory({ name, description, slug });
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, slug } = req.body;

    if (!id || !name || !slug) {
      res.status(400).json({ error: "Datos inválidos para actualizar la categoría" });
      return;
    }

    const success = await CategoryService.updateCategory(id, { name, description, slug });
    if (!success) {
      res.status(404).json({ error: "Categoría no encontrada o no se aplicaron cambios" });
      return;
    }

    res.status(200).json({ message: "Categoría actualizada correctamente" });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Slug")) {
      res.status(409).json({ error: error.message }); // Código 409: Conflicto
    } else {
      console.error("Error al actualizar la categoría:", error);
      res.status(500).json({ error: "Error interno al actualizar la categoría" });
    }
  }
};






export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    console.log("Intentando eliminar categoría con ID:", id); // Log para debugging

    const success = await CategoryService.deleteCategory(id);
    if (!success) {
      res.status(404).json({ error: "Categoría no encontrada o ya eliminada" });
      return;
    }

    res.status(200).json({ message: "Categoría eliminada" });
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    res.status(500).json({ error: "Error al eliminar la categoría" });
  }
};
