import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import config from "./config/env";

import routes from "./routes";

const app = express();

app.use(cors({
    origin: [config.frontendUrl, "http://localhost:8080"],
    credentials: true
}));

app.use(express.json({
    verify: (req: Request, _res, buffer) => {
        if (req.originalUrl.includes("/webhooks")) {
            req.rawBody = Buffer.from(buffer);
        }
    }
}));

app.use(cookieParser());

app.get("/health", async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(200).json({
            message: "NodeJs"
        })
    } catch (error) {
        next(error)
    }
})

app.use("/api", routes);

app.use(errorHandler)

export default app;
