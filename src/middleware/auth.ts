import {Request, Response, NextFunction} from 'express';
const jwt = require('jsonwebtoken');

interface JwtPayload {
    username: string;
    iat: number;
    exp: number;
}

// Extend Express Request to include user property
declare global {
    namespace Express {
      interface Request {
        user?: JwtPayload;
      }
    }
}

export default function checkLoggedIn(req: Request, res: Response, next: NextFunction): void{
    const token = req.cookies?.token;
    

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
  
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;
        //we set req.user to our payload - thats the one we used when signing the jwt. We can now access stuff about who is logged in!
        req.user = decoded;
        next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
}
