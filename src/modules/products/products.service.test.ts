import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { BaseError } from "../../common/errors/base.error";
import { ProductsService } from "./products.service";

const skuData = {
    product_id: "product-1",
    sku: "SKU-1",
    attributes_ids: [],
};

const createService = (
    createSku: (data: typeof skuData & { quantity: number | string; price: number | string }) => Promise<unknown>
) => {
    const repository = {
        createSku,
    };
    const storage = {
        uploadImage: async () => "https://example.com/image.jpg",
    };

    return new ProductsService(repository as never, storage as never);
};

describe("ProductsService.createSku", () => {
    it("normalizes multipart quantity and price values before persistence", async () => {
        let receivedData: typeof skuData & { quantity: number | string; price: number | string } | undefined;
        const service = createService(async (data) => {
            receivedData = data;
            return data;
        });

        await service.createSku(
            { ...skuData, quantity: "10", price: "12.50" },
            [],
            {} as Express.Multer.File
        );

        assert.deepEqual(receivedData, {
            ...skuData,
            quantity: 10,
            price: 12.5,
        });
    });

    it("rejects invalid or unsafe SKU values", async () => {
        const service = createService(async (data) => data);

        for (const data of [
            { quantity: "-1", price: "10" },
            { quantity: "1.5", price: "10" },
            { quantity: "10", price: "not-a-number" },
            { quantity: "10", price: "Infinity" },
            { quantity: "", price: "10" },
            { quantity: "10", price: " " },
        ]) {
            await assert.rejects(
                service.createSku({ ...skuData, ...data }, [], {} as Express.Multer.File),
                (error: BaseError) =>
                    error.name === "InvalidSku" && error.statusCode === 400
            );
        }
    });
});
