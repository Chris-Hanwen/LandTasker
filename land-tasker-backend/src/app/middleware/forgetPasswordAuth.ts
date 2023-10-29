import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/user';
import status from 'http-status';
import config from '../config/app';

interface JwtPayload extends jwt.JwtPayload {
  email: string;
}
const authenticationEmailTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  const authType = authHeader && authHeader.split(' ')[0];
  const authToken = authHeader && authHeader.split(' ')[1];

  if (!authHeader || !authToken) return res.sendStatus(status.UNAUTHORIZED);

  try {
    if (authType === 'Bearer') {
      const verifyUser = jwt.verify(authToken, config.secret) as JwtPayload;
      const user = await User.findOne({ email: verifyUser.email });
      if (!user) return res.status(status.FORBIDDEN).send();
      req.email = user.email;
      next();
    }
  } catch (error) {
    res.status(status.FORBIDDEN).send();
  }
};

export { authenticationEmailTokenMiddleware };
