import { Request, Response, NextFunction } from 'express';

import ensureAuthenticated from './ensureAuthenticated';

import admin from '../config/admin'
import AppError from '../errors/AppError';

export default function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  ensureAuthenticated(request, response, next)

  if (!admin.users.includes(request.user.id_user)) {
    throw new AppError('Invalid admin JWT token', 401);
  }

  return next();
}
