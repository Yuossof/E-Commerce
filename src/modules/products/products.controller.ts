import { NextFunction, Request, Response } from "express";
import { ProductsService } from "./products.service";
import { CreateProductAttributeDTO, CreateSkuDTO } from "./products.types";

export class ProductsController {
  private productService: ProductsService

  constructor(productService: ProductsService) {
    this.productService = productService
  }

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as {
        images?: Express.Multer.File[];
        cover?: Express.Multer.File[];
      };

      const images = files.images ?? [];
      const cover = files.cover?.[0] as Express.Multer.File

      const data = req.body

      const product = await this.productService.createProduct(data, images, cover)

      res.status(200).json({ data: product, success: true })

    } catch (error) {
      next(error)
    }
  }

  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let page = Number(req.query.page)
      let limit = Number(req.query.limit)

      const products = await this.productService.listProducts(page, limit)

      return res.status(200).json({ data: products, success: true })
    } catch (error) {
      next(error)
    }
  }

  getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.productId as string
      const product = await this.productService.getProduct(productId)
      return res.status(200).json({
        data: product
      })

    } catch (error) {
      next(error)
    }
  }

  getProductsWithSkus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await this.productService.listAllWithSkus()
      return res.status(200).json({
        data: products
      })
    } catch (error) {
      next(error)
    }
  }

  createProductAttribute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as CreateProductAttributeDTO
      const attribute = await this.productService.createProductAttribute(data)

      return res.status(201).json({ data: attribute, success: true })
    } catch (error) {
      next(error)
    }
  }

  createSku = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as {
        images?: Express.Multer.File[];
        cover?: Express.Multer.File[];
      };

      const images = files.images ?? [];
      const cover = files.cover?.[0] as Express.Multer.File

      const data = req.body as CreateSkuDTO
      const sku = await this.productService.createSku(data, images, cover)
      return res.status(201).json({
        data: sku,
        message: "Product sku created"
      })
    } catch (error) {
      next(error)
    }
  }
}