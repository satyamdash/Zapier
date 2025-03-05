import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

export function authMiddleware (req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization as unknown as string;
    console.log(token);
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        // @ts-ignore
        req.id = payload.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Unauthorized" });
    }
}