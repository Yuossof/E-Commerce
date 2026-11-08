import { Router } from "express"
import { upload } from "../../utils/multer.utils"
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { ProductsRepository } from "./products.repository";
import { S3StorageService } from "../../services/s3/s3.service";
import { isAuthenticated, requireRole } from "../../middleware/auth/authentication.middleware";

const router = Router()

const productsRepo = new ProductsRepository()
const storageService = new S3StorageService()
const productsService = new ProductsService(productsRepo, storageService)
const productsController = new ProductsController(productsService)

// Create product
router.post(
    "/",
    isAuthenticated,
    requireRole("admin"),
    upload.fields([
        { name: "images", maxCount: 15 },
        { name: "cover", maxCount: 1 },
    ]),
    productsController.createProduct
)

// Create sku
router.post(
    "/skus",
    isAuthenticated,
    requireRole("admin"),
    upload.fields([
        { name: "images", maxCount: 15 },
        { name: "cover", maxCount: 1 },
    ]),
    productsController.createSku
)

router.post("/product-attributes", isAuthenticated, requireRole("admin"), productsController.createProductAttribute)

router.get("/products-skus", productsController.getProductsWithSkus)
router.get("/", productsController.getProducts)
router.get("/:productId", productsController.getProduct)

export default router