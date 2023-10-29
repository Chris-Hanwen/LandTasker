import { Request, Response } from 'express';
import User from '../../../model/user';
import bcrypt from 'bcrypt';
import config from '../../../config/app';
import jwt from 'jsonwebtoken';
import { emailCheck } from '../../../services/emailCheck';
import status from 'http-status';

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!(await emailCheck(email))) {
      res.status(status.NOT_FOUND).send();
    }
    const userInfo = await User.findOne({ email });
    if (userInfo == null) return res.status(status.NOT_FOUND).send();
    const encryptPasswordCheck = await bcrypt.compare(password, userInfo.password);
    if (!encryptPasswordCheck) {
      res.status(status.UNAUTHORIZED).send();
    }
    const token = jwt.sign({ _id: userInfo._id.toJSON() }, config.secret, { expiresIn: '72h' });
    res.status(status.OK).send({ userInfo, token });
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).send();
  }
};

export { loginUser };
