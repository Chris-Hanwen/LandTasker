import { Request, Response } from 'express';
import User from '../../../model/user';
import { emailCheck } from '../../../services/emailCheck';
import status from 'http-status';
import config from '../../../config/app';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { resetPasswordEmail } from '../../../utils/resetPasswordEmailSender';
import { encryptPassword } from '../../../services/passwordHandle/encryption';

const forgetPassword = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(status.UNPROCESSABLE_ENTITY).send();
  try {
    const { email } = req.body;
    const emailCheckFlag = emailCheck(email);
    if (!emailCheckFlag) return res.status(status.NOT_FOUND).send();
    const user = await User.findOne({ email, active: true });
    const token = jwt.sign({ email }, config.secret, { expiresIn: '30m' });
    if (user) {
      await resetPasswordEmail(email, user?.fullName, token);
      res.status(status.ACCEPTED).send();
    }
    res.status(status.BAD_REQUEST).send();
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).send();
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(status.UNPROCESSABLE_ENTITY).send();
  try {
    const email = req.email;
    const newPassword = req.body.password;
    const encrypted = await encryptPassword(newPassword);
    const updatePasswordFlag = await User.findOneAndUpdate(
      { email },
      { password: encrypted.hashPassword, passwordSalt: encrypted.salt },
    );
    if (!updatePasswordFlag) res.status(status.BAD_REQUEST).send();
    res.status(status.ACCEPTED).send();
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR);
  }
};

export { forgetPassword, resetPassword };
