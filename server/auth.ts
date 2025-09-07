import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

export interface AuthRequest extends Request {
  userId?: number;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, payload: any) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    req.userId = payload.userId;
    next();
  });
}
