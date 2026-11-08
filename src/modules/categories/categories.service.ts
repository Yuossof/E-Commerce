import { CreateCategoryDTO, UpdateCategoryDTO } from "./categories.types";
import { BaseError } from "../../common/errors/base.error";
import { CategoriesRepository } from "./categories.repository";

export class CategoriesService {
    private repository: CategoriesRepository

    constructor(repository: CategoriesRepository) {
        this.repository = repository
    }

    async create(data: CreateCategoryDTO) {
        const category = await this.repository.findByName(data.name)

        if (category) {
            throw new BaseError(
                "CategoryAlreadyExists",
                409,
                true,
                "A category with this name already exists"
            )
        }

        const newCategory = await this.repository.createCategory(data)

        return newCategory
    }

    async listAll() {
        const categories = await this.repository.findAll()
        return categories
    }


    async update(data: UpdateCategoryDTO, id: string) {
        const updatedCategory = await this.repository.update(id, data);

        if (!updatedCategory) {
            throw new BaseError("CategoryNotFound", 404, true, "Category not found")
        }

        return updatedCategory
    }
}