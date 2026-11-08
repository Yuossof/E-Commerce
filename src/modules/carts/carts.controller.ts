import { NextFunction, Request, Response } from "express";
import {  CreateCartItemDTO } from "./carts.types";
import { CartsService } from "./carts.service";

export class CartsController {
    private cartsService: CartsService
    constructor(cartService: CartsService) {
        this.cartsService = cartService
    }

    addItemToCart = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body as CreateCartItemDTO
            const userId = req.user.userId
            await this.cartsService.addItemToCart(userId, data.quantity, data.product_sku_id)
            return res.status(200).json({
                message: "item added"
            })
        } catch (error) {
            next(error)
        }
    }

    getCartItems = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cartItems = await this.cartsService.getCartItems(req.user.userId)
            return res.status(200).json({
                data: cartItems
            })
        } catch (error) {
            next(error)
        }
    }

    deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body as {cartItemId: string}
            await this.cartsService.deleteCartItem(req.user.userId, body.cartItemId)
            return res.status(200).json({
                message: "Item deleted"
            })
        } catch (error) {
            next(error)
        }
    }

}