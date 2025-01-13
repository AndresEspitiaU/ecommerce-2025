import type { Request, Response } from 'express';
import * as CuponService from '@/services/cupon.service';

// Obtener todos los cupones activos
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const cupones = await CuponService.getAllCupones();
    res.status(200).json(cupones);
  } catch (error) {
    console.error('Error al obtener los cupones:', error);
    res.status(500).json({ error: 'Error al obtener los cupones' });
  }
};

// Obtener un cupón por ID
export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const cupon = await CuponService.getCuponById(Number(id));
    if (!cupon) {
      res.status(404).json({ error: 'Cupón no encontrado' });
      return;
    }
    res.status(200).json(cupon);
  } catch (error) {
    console.error('Error al obtener el cupón:', error);
    res.status(500).json({ error: 'Error al obtener el cupón' });
  }
};

// Crear un nuevo cupón
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const cupon = await CuponService.createCupon(req.body);
    res.status(201).json(cupon);
  } catch (error) {
    console.error('Error al crear el cupón:', error);
    res.status(500).json({ error: 'Error al crear el cupón' });
  }
};

// Actualizar un cupón existente
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await CuponService.updateCupon(Number(id), req.body);

    if (!success) {
      res.status(404).json({ error: 'Cupón no encontrado o no actualizado' });
      return;
    }

    res.status(200).json({ message: 'Cupón actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el cupón:', error);
    res.status(500).json({ error: 'Error al actualizar el cupón' });
  }
};

// Eliminar (desactivar) un cupón
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await CuponService.deleteCupon(Number(id));

    if (!success) {
      res.status(404).json({ error: 'Cupón no encontrado o no eliminado' });
      return;
    }

    res.status(200).json({ message: 'Cupón eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el cupón:', error);
    res.status(500).json({ error: 'Error al eliminar el cupón' });
  }
};

// Eliminar un cupón permanentemente
export const removePermanent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await CuponService.deleteCuponPermanentemente(Number(id));

    if (!success) {
      res.status(404).json({ error: 'Cupón no encontrado o no eliminado permanentemente' });
      return;
    }

    res.status(200).json({ message: 'Cupón eliminado permanentemente' });
  } catch (error) {
    console.error('Error al eliminar el cupón permanentemente:', error);
    res.status(500).json({ error: 'Error al eliminar el cupón permanentemente' });
  }
};
