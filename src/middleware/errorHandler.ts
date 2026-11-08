import { NextFunction, Request, Response } from "express";
import { BaseError } from "../common/errors/base.error";
import winston from "winston";



const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
    level: "error",
    format: combine(timestamp(), json()),
    transports: [new winston.transports.Console()],
});

export const errorHandler = (error: unknown, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof BaseError) {
        logger.error("Request failed", {
            statusCode: error.statusCode,
            error: error.name,
            message: error.message,
        })
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        })
    }

    if (error instanceof Error) {
        logger.error("Unhandled application error", {
            error: error.name,
            message: error.message,
        })
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

    logger.error("Unhandled non-error exception")
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    })
}