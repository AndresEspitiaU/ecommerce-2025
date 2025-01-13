import type { Request, Response } from 'express';
import * as MarcaService from '@/services/marca.service';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const marcas = await MarcaService.getAllMarcas();
    res.status(200).json(marcas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las marcas' });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const marca = await MarcaService.getMarcaById(Number(id));
    if (!marca) {
      res.status(404).json({ error: 'Marca no encontrada' });
      return;
    }
    res.status(200).json(marca);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la marca' });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const marca = await MarcaService.createMarca(req.body);
    res.status(201).json(marca);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la marca' });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await MarcaService.updateMarca(Number(id), req.body);

    if (!success) {
      res.status(404).json({ error: 'Marca no encontrada o no actualizada' });
      return;
    }

    res.status(200).json({ message: 'Marca actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la marca:', error);
    res.status(500).json({ error: 'Error al actualizar la marca' });
  }
};

// Controlador para eliminar una marca (Desactivar)
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await MarcaService.deleteMarca(Number(id));
    if (!success) {
      res.status(404).json({ error: 'Marca no encontrada o no eliminada' });
      return;
    }
    res.status(200).json({ message: 'Marca eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la marca' });
  }
};

// Controlador para eliminar una marca permanentemente
export const eliminarMarca = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { permanente } = req.query; // Usa ?permanente=true para eliminar físicamente

  try {
    if (permanente === 'true') {
      const success = await MarcaService.deleteMarcaPermanentemente(Number(id));
      if (!success) {
        res.status(404).json({ error: 'Marca no encontrada o no eliminada' });
        return;
      }
      res.status(200).json({ message: 'Marca eliminada permanentemente' });
    } else {
      const success = await MarcaService.deleteMarca(Number(id));
      if (!success) {
        res.status(404).json({ error: 'Marca no encontrada o no eliminada' });
        return;
      }
      res.status(200).json({ message: 'Marca eliminada correctamente' });
    }
  } catch (error) {
    console.error('Error en el controlador de eliminar marca:', error);
    res.status(500).json({ error: 'Error al eliminar la marca' });
  }
};