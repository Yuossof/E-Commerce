import sql from "../../config/db";
import { CreateProductAttributeDTO, CreateProductDTO, CreateSkuDTO, IProduct, ISku } from "./products.types";

export class ProductsRepository {
    async create(
        data: CreateProductDTO,
        cover_url: string,
        productImages: string[]
    ): Promise<{ product: IProduct }> {
        const [product] = await sql<IProduct[]>`
            INSERT INTO products (name, description, summary, cover, category_id, images)
            VALUES (${data.name}, ${data.description}, ${data.summary}, ${cover_url}, ${data.category_id}, ${productImages})
            RETURNING id, name, description, summary, cover, category_id, images
        `
        return { product }
    }

    async list(limit: number, offset: number) {
        const products = await sql`
          SELECT * FROM products ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
        `;

        return products
    }

    async listAllWithSkus() {
        const products = await sql`
          SELECT p.id, p.name, p.description, p.summary, p.cover, p.images, p.category_id, p.created_at,
           COALESCE(
               json_agg(
                 json_build_object(
                   'id', ps.id,
                   'product_id', ps.product_id,
                   'category_id', p.category_id,
                   'sku', ps.sku,
                   'price', ps.price,
                   'quantity', ps.quantity,
                   'cover', ps.cover,
                   'images', ps.images,
                   'created_at', ps.created_at
                 )
               ) FILTER (WHERE ps.id IS NOT NULL), '[]'
             ) AS skus
          FROM products p
          LEFT JOIN products_skus ps ON p.id = ps.product_id
          GROUP BY p.id
          ORDER BY p.created_at DESC;
        `

        return products
    }

    async createAttribute(data: CreateProductAttributeDTO) {
        const [attribute] = await sql`
           INSERT INTO product_attributes (type, value)
           VALUES (${data.type}, ${data.value})
           RETURNING *
        `

        return attribute
    }


    async getProductById(productId: string) {
        const [product] = await sql<IProduct[]>`
          SELECT * FROM products WHERE id = ${productId}
        `

        return product
    }

    async createSku(data: CreateSkuDTO, images: string[], cover: string) {
        const [sku] = await sql<ISku[]>`
          INSERT INTO products_skus (product_id, sku, quantity, price, cover, images)
          VALUES (
           ${data.product_id},
           ${data.sku},
           ${data.quantity},
           ${data.price},
           ${cover},
           ${images}
          )
           RETURNING *
        `

        return sku
    }
}