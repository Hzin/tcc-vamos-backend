import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import admin from '../config/admin';

import authConfig from '../config/auth';

import AppError from '../errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const adminToken = request.admin_token;

  if (admin.key != adminToken) {
    throw new AppError('You don\'t have permission to perform this action.', 401);
  }

  next();
}
