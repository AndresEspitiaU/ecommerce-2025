import { Router } from "express";
import * as CategoryController from "@/controllers/category.controller";

const router = Router();

// Rutas para obtener todas las categorias
router.get("/", CategoryController.getAll);

// Rutas para obtener por ir una categoria
router.get("/:id", CategoryController.getById);

// Ruta para crear una categoria
router.post("/", CategoryController.create);

// Ruta para actualizar una categoria
router.put("/:id", CategoryController.update);

// Ruta para eliminar una categoria
router.delete("/:id", CategoryController.remove);

export default router;
