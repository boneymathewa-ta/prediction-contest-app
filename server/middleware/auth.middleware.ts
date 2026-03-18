// server/middleware/auth.middleware.ts
// server/middleware/auth.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    // Look for the "Authorization" header (format: "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const secret = process.env.JWT_SECRET || 'your_fallback_secret';
        const decoded = jwt.verify(token, secret);

        // Attach the user data to the request object
        (req as any).username = decoded.username; // Assuming the token contains a "username" field
        console.log("Decoded token:", decoded);
        console.log("Authenticated user ID:", (req as any).username);
        next(); // Move to the controller
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token." });
    }
};