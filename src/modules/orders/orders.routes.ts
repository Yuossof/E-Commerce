import { Router } from "express";
import { OrdersRepository } from "./orders.repository";
import { OrdersService } from "./orders.service";
import { CartItemsRepository } from "../carts/cart-items.repository";
import { OrdersController } from "./orders.controller";
import { isAuthenticated } from "../../middleware/auth/authentication.middleware";
import { PaymentsService } from "../payment/payments.service";
import { PaymentsRepository } from "../payment/payments.repository";
import { InventoryRepository } from "../products/inventory.repository";

const router = Router()

const orderRepository = new OrdersRepository()
const cartItemsRepository = new CartItemsRepository()
const inventoryRepo = new InventoryRepository()
const paymentsRepo = new PaymentsRepository(inventoryRepo)
const paymentsService = new PaymentsService(paymentsRepo)
const orderService = new OrdersService(orderRepository, cartItemsRepository, paymentsService)
const orderController = new OrdersController(orderService)

router.post("/", isAuthenticated, orderController.createOrder)
router.get("/", isAuthenticated, orderController.getOrders)
router.get("/:orderId", isAuthenticated, orderController.getOrder)

export default router