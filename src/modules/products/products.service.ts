import { S3StorageService } from "../../services/s3/s3.service";
import { ProductsRepository } from "./products.repository";
import { CreateProductAttributeDTO, CreateProductDTO, CreateSkuDTO, IProduct } from "./products.types";
import { BaseError } from "../../common/errors/base.error";
import { client } from "../../config/redis";

export class ProductsService {
    private productRepository: ProductsRepository
    private s3StorageService: S3StorageService

    constructor(productRepository: ProductsRepository, s3StorageService: S3StorageService) {
        this.productRepository = productRepository
        this.s3StorageService = s3StorageService
    }

    async createProduct(data: CreateProductDTO, images: Express.Multer.File[], cover: Express.Multer.File) {
        if (!cover) {
            throw new BaseError("ProductCoverRequired", 400, true, "A product cover image is required")
        }

        let productImages: string[] = []

        const cover_url = await this.s3StorageService.uploadImage(cover)

        for (const img of images) {
            const url = await this.s3StorageService.uploadImage(img)
            productImages.push(url)
        }

        const product = await this.productRepository.create(data, cover_url, productImages)

        return product
    }

    async listProducts(page: number, limit: number) {
        if (!page || page <= 0) {
            page = 1;
        }

        if (!limit || limit <= 0) {
            limit = 10;
        }

        const offset = (page - 1) * limit
        const products = await this.productRepository.list(limit, offset)
        return products
    }

    async createProductAttribute(data: CreateProductAttributeDTO) {
        return this.productRepository.createAttribute(data)
    }

    async getProduct(productId: string) {
        const cachedProduct = await client.get(productId)

        if (cachedProduct) {
            const product = JSON.parse(cachedProduct)
            console.log("GET FROM REDIS")
            return product
        }

        const product = await this.productRepository.getProductById(productId)
        console.log("GET FROM DATABASE")
        await client.set(product.id, JSON.stringify(product), {
            EX: 600
        })
        
        return product
    }

    async createSku(data: CreateSkuDTO, images: Express.Multer.File[], cover: Express.Multer.File) {
        if (!cover) {
            throw new BaseError("SkuCoverRequired", 400, true, "A SKU cover image is required")
        }

        const hasEmptyValue = (value: number | string) =>
            typeof value === "string" && value.trim() === ""
        const quantity = Number(data.quantity)
        const price = Number(data.price)

        if (
            hasEmptyValue(data.quantity) ||
            hasEmptyValue(data.price) ||
            !Number.isSafeInteger(quantity) ||
            quantity < 0 ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            throw new BaseError("InvalidSku", 400, true, "SKU quantity and price must be valid non-negative values")
        }

        let skuImages: string[] = []

        const cover_url = await this.s3StorageService.uploadImage(cover)

        for (const img of images) {
            const url = await this.s3StorageService.uploadImage(img)
            skuImages.push(url)
        }

        return this.productRepository.createSku(
            { ...data, quantity, price },
            skuImages,
            cover_url
        )
    }

    async listAllWithSkus() {
        return this.productRepository.listAllWithSkus()
    }
}