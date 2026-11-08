import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth/authentication.middleware";
import { CartsService } from "./carts.service";
import { CartsRepository } from "./carts.repository";
import { CartItemsRepository } from "./cart-items.repository";
import { CartsController } from "./carts.controller";

const router = Router()
const cartsRepo = new CartsRepository()
const cartItemsRepo = new CartItemsRepository()
const cartsService = new CartsService(cartItemsRepo, cartsRepo)
const cartsController = new CartsController(cartsService)

router.post("/", isAuthenticated, cartsController.addItemToCart)
router.get("/", isAuthenticated, cartsController.getCartItems)
router.post("/delete", isAuthenticated, cartsController.deleteCartItem)

export default router