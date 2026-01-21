import { Request, Response, NextFunction } from "express";

// JwtPayload ek TypeScript type hai jo batata hai ki JWT token ke andar ka decoded data kaisa hota hai.
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId?: string;
}

const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.token as string | undefined;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token Not Found"
            });
        }

        const secret = process.env.SECRET_KEY as string;

        const decoded = jwt.verify(token, secret) as JwtPayload;

        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
        
    }
};

export default authMiddleware