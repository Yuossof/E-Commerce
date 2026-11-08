import sql from "../../config/db";
import { CreateAddressDTO, UpdateAddressDTO } from "./addresses.types";

export class AddressesRepository {
    async create(userId: string, data: CreateAddressDTO) {
        const [address] = await sql`
            INSERT INTO addresses (
                user_id,
                full_name,
                phone,
                city,
                area,
                street,
                building,
                apartment,
                notes
            )
            VALUES (
                ${userId},
                ${data.full_name},
                ${data.phone},
                ${data.city},
                ${data.area ?? null},
                ${data.street},
                ${data.building ?? null},
                ${data.apartment ?? null},
                ${data.notes ?? null}
            )
            RETURNING *
        `;

        return address;
    }

    async findAllByUserId(userId: string) {
        return sql`
            SELECT *
            FROM addresses
            WHERE user_id = ${userId}
            ORDER BY created_at DESC
        `;
    }

    async findByIdAndUserId(userId: string, addressId: string) {
        const [address] = await sql`
            SELECT *
            FROM addresses
            WHERE id = ${addressId}
              AND user_id = ${userId}
        `;

        return address;
    }

    async updateByIdAndUserId(userId: string, addressId: string, data: UpdateAddressDTO) {
        const [address] = await sql`
            UPDATE addresses
            SET
                full_name = ${data.full_name},
                phone = ${data.phone},
                city = ${data.city},
                area = ${data.area ?? null},
                street = ${data.street},
                building = ${data.building ?? null},
                apartment = ${data.apartment ?? null},
                notes = ${data.notes ?? null},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${addressId}
              AND user_id = ${userId}
            RETURNING *
        `;

        return address;
    }

    async deleteByIdAndUserId(userId: string, addressId: string) {
        const [address] = await sql`
            DELETE FROM addresses
            WHERE id = ${addressId}
              AND user_id = ${userId}
            RETURNING id
        `;

        return address;
    }
}
