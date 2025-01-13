import type { Request, Response } from 'express';
import * as ColorService from '@/services/color.service';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const colores = await ColorService.getAllColors();
    res.status(200).json(colores);
  } catch (error) {
    console.error('Error al obtener los colores:', error);
    res.status(500).json({ error: 'Error al obtener los colores' });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const color = await ColorService.getColorById(Number(id));
    if (!color) {
      res.status(404).json({ error: 'Color no encontrado' });
      return;
    }
    res.status(200).json(color);
  } catch (error) {
    console.error('Error al obtener el color:', error);
    res.status(500).json({ error: 'Error al obtener el color' });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const color = await ColorService.createColor(req.body);
    res.status(201).json(color);
  } catch (error) {
    console.error('Error al crear el color:', error);
    res.status(500).json({ error: 'Error al crear el color' });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await ColorService.updateColor(Number(id), req.body);

    if (!success) {
      res.status(404).json({ error: 'Color no encontrado o no actualizado' });
      return;
    }

    res.status(200).json({ message: 'Color actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el color:', error);
    res.status(500).json({ error: 'Error al actualizar el color' });
  }
};


// Eliminar lógicamente una color (desactivar)
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await ColorService.deleteColor(Number(id));

    if (!success) {
      res.status(404).json({ error: 'Color no encontrado o no eliminado' });
      return;
    }

    res.status(200).json({ message: 'Color eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el color:', error);
    res.status(500).json({ error: 'Error al eliminar el color' });
  }
};

// Eliminar permanentemente una color
export const eliminarColorPermanentemente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await ColorService.deleteColorPermanentemente(Number(id));

    if (!success) {
      res.status(404).json({ error: 'Color no encontrado o no eliminado' });
      return;
    }

    res.status(200).json({ message: 'Color eliminado permanentemente' });
  } catch (error) {
    console.error('Error al eliminar el color permanentemente:', error);
    res.status(500).json({ error: 'Error al eliminar el color permanentemente' });
  }
};
