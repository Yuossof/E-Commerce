import { NextFunction, Request, Response } from "express"

export class PaymentsController {
    createPayment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user.userId
            
        } catch (error) {
            next(error)
        }
    }
}