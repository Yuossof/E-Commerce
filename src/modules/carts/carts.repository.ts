import sql from "../../config/db";

export class CartsRepository {
  async findByUserId(userId: string) {
    const [cart] = await sql<{ id: string }[]>`
          SELECT id FROM carts WHERE user_id = ${userId}
        `
    return cart
  }

  async create(userId: string) {
    const [newCart] = await sql<{ id: string }[]>`
          INSERT INTO carts (user_id) VALUES (${userId})
          RETURNING id
        `

    return newCart
  }

  async deleteByUserId(userId: string) {
    await sql`
      DELETE FROM carts
      WHERE user_id = ${userId}
    `
  }
}