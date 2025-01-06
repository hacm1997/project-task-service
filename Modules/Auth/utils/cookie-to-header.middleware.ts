import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CookieToHeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.['auth.user'];
    if (token) {
      req.headers.authorization = `Bearer ${token}`;
    }
    next();
  }
}
