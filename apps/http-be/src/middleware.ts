import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = req.headers.authorization ?? "";
        const decoded = jwt.verify(header, JWT_SECRET);
        
        if(decoded) {
            if(typeof decoded !== "object") {
                res.status(401).json({
                    message: "Unauthorized",
                    from: "decoded"
                });
                return ;
            }
            // TODO: fix
            // @ts-ignore
            req.userId = decoded.userId;
            next();
        }1
    } catch(e) {
        res.status(401).json({
            message: "Unauthorized",
            from: "catch"
        });
    }
}