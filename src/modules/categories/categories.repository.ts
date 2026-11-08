import sql from "../../config/db";
import { CreateCategoryDTO } from "./categories.types";

export class CategoriesRepository {
    async findByName(categoryName: string) {
        const [existingCategory] = await sql`
          SELECT id FROM categories WHERE name = ${categoryName} LIMIT 1
        `;

        return existingCategory
    }

    async createCategory(data: CreateCategoryDTO) {
        const [newCategory] = await sql`
         INSERT INTO categories (name, slug, description) 
         VALUES (${data.name}, ${data.slug}, ${data.description})
         RETURNING id, name, created_at
        `;

        return newCategory
    }

    async findAll() {
        const categories = await sql`
          SELECT * FROM categories
        `;

        return categories
    }

    async update(id: string, data: CreateCategoryDTO) {
        const [category] = await sql`
          UPDATE categories
          SET name = ${data.name},
              description = ${data.description},
              slug = ${data.slug},
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${id}
          RETURNING id, name, slug, description, parent_id, created_at, updated_at
        `;

        return category
    }
}