import { NextFunction, Request, Response } from "express";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDTO, UpdateCategoryDTO } from "./categories.types";

export class CategoriesController {
    private categoryService: CategoriesService
    constructor(categoryService: CategoriesService) {
        this.categoryService = categoryService
    }

    createCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body as CreateCategoryDTO
            const newCategory = await this.categoryService.create(data)
            return res.status(201).json({
                data: newCategory
            })
        } catch (error) {
            next(error)
        }
    }


    getCategories = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categories = await this.categoryService.listAll()
            return res.status(200).json({
                data: categories
            })
        } catch (error) {
            next(error)
        }
    }

    updateCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body as UpdateCategoryDTO
            const id = req.params.id as string
            const updatedCategory = await this.categoryService.update(data, id)
            return res.status(200).json({
                data: updatedCategory
            })
        } catch (error) {
            next(error)
        }
    }
}