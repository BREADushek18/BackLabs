import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: "student" | "teacher";
    }
  }
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: "student" | "teacher";
    };

    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ message: "Invalid token." });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
