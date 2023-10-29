import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/user';
import status from 'http-status';
import config from '../config/app';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    user?: object;
    token?: string;
  }
}

interface JwtPayload extends jwt.JwtPayload {
  _id: string;
}
const authenticationTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  const authType = authHeader && authHeader.split(' ')[0];
  const authToken = authHeader && authHeader.split(' ')[1];

  if (!authHeader || !authToken) return res.sendStatus(status.UNAUTHORIZED);

  try {
    if (authType === 'Bearer') {
      const verifyUser = jwt.verify(authToken, config.secret) as JwtPayload;
      const user = await User.findById({ _id: verifyUser._id });
      if (!user) return res.status(status.FORBIDDEN).send();
      req.user = user;
      req.token = authToken;
      req.userId = verifyUser._id;
      return next();
    }
  } catch (error) {
    res.status(status.FORBIDDEN).send();
  }
};

export { authenticationTokenMiddleware };
