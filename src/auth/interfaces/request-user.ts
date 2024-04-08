import { Request } from 'express';
import { PayloadToken } from './payload-jwt';

export interface RequestWithUser extends Request {
  user: PayloadToken;
}
