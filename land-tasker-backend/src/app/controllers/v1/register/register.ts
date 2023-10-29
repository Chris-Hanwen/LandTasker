import User from '../../../model/user';
import { emailCheck } from '../../../services/emailCheck';
import { Request, Response } from 'express';
import { encryptPassword } from '../../../services/passwordHandle/encryption';
import { randomStringGenerator } from '../../../utils/randomStringGenerator';
import status from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../../../config/app';
import { emailSender } from '../../../utils/emailSender';

declare module 'express-serve-static-core' {
  interface Request {
    email?: string;
    password?: string;
    fullName?: string;
  }
}

const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;
    const existsUsers: boolean = await emailCheck(email);
    if (existsUsers) return res.status(status.FOUND).send();
    const encrypted = await encryptPassword(password);
    const activationCode = randomStringGenerator();
    const user = await User.create({
      email,
      password: encrypted.hashPassword,
      passwordSalt: encrypted.salt,
      fullName,
      activationCode,
    });
    if (!user) return res.status(status.SERVICE_UNAVAILABLE).send();
    const token = jwt.sign({ email }, config.secret);
    await emailSender(email, activationCode);
    return res.status(status.CREATED).send({ user, token });
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).send();
  }
};

const activateUser = async (req: Request, res: Response) => {
  try {
    const { activationCode } = req.params;
    const activatedUser = await User.findOneAndUpdate(
      { activationCode },
      { active: true },
      { new: true },
    );
    if (!activatedUser?.active) {
      res.status(status.SERVICE_UNAVAILABLE).send();
    }
    res.status(status.ACCEPTED).send();
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).send();
  }
};
export { registerUser, activateUser };
