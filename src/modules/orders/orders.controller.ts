import { NextFunction, Request, Response } from "express";
import { OrdersService } from "./orders.service";

export class OrdersController {
    private orderService: OrdersService
    constructor(orderService: OrdersService) {
        this.orderService = orderService
    }

    createOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { order, clientSecret } = await this.orderService.create(req.user.userId)
            return res.status(201).json({
                data: {
                    order,
                    clientSecret: clientSecret
                },
                
            })
        } catch (error) {
            next(error)
        }
    }

    getOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orders = await this.orderService.getOrders(req.user.userId)
            return res.status(200).json({
                data: orders
            })
        } catch (error) {
            next(error)
        }
    }

    getOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orderId = req.params["orderId"] as string
            const userId = req.user.userId
            const order = await this.orderService.getOrder(userId, orderId)
            return res.status(200).json({
                data: order
            })
        } catch (error) {
            next(error)
        }
    }

}