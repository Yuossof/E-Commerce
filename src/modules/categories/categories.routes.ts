import { Router } from "express";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { CategoriesRepository } from "./categories.repository";
import { isAuthenticated, requireRole } from "../../middleware/auth/authentication.middleware";


const router = Router()

const categoriesRepository = new CategoriesRepository()
const categoriesService = new CategoriesService(categoriesRepository)
const categoriesController = new CategoriesController(categoriesService)

router.post("/", isAuthenticated, requireRole("admin"), categoriesController.createCategory)
router.get("/", categoriesController.getCategories)
router.put("/:id", isAuthenticated, requireRole("admin"), categoriesController.updateCategory)

export default router