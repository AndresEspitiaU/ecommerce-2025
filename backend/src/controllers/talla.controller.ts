import type { Request, Response } from 'express';
import * as TallaService from '@/services/talla.service';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const tallas = await TallaService.getAllTallas();
    res.status(200).json(tallas);
  } catch (error) {
    console.error('Error al obtener las tallas:', error);
    res.status(500).json({ error: 'Error al obtener las tallas' });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const talla = await TallaService.getTallaById(Number(id));
    if (!talla) {
      res.status(404).json({ error: 'Talla no encontrada' });
      return;
    }
    res.status(200).json(talla);
  } catch (error) {
    console.error('Error al obtener la talla:', error);
    res.status(500).json({ error: 'Error al obtener la talla' });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const talla = await TallaService.createTalla(req.body);
    res.status(201).json(talla);
  } catch (error) {
    console.error('Error al crear la talla:', error);
    res.status(500).json({ error: 'Error al crear la talla' });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await TallaService.updateTalla(Number(id), req.body);
    if (!success) {
      res.status(404).json({ error: 'Talla no encontrada o no actualizada' });
      return;
    }
    res.status(200).json({ message: 'Talla actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la talla:', error);
    res.status(500).json({ error: 'Error al actualizar la talla' });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await TallaService.deleteTalla(Number(id));
    if (!success) {
      res.status(404).json({ error: 'Talla no encontrada o no eliminada' });
      return;
    }
    res.status(200).json({ message: 'Talla eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la talla:', error);
    res.status(500).json({ error: 'Error al eliminar la talla' });
  }
};

export const removePermanent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await TallaService.deleteTallaPermanentemente(Number(id));
    if (!success) {
      res.status(404).json({ error: 'Talla no encontrada o no eliminada permanentemente' });
      return;
    }
    res.status(200).json({ message: 'Talla eliminada permanentemente' });
  } catch (error) {
    console.error('Error al eliminar la talla permanentemente:', error);
    res.status(500).json({ error: 'Error al eliminar la talla permanentemente' });
  }
};
