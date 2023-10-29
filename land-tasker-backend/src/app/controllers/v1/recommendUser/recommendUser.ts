import { Request, Response } from 'express';
import User from '../../../model/user';
import { validationResult } from 'express-validator';
import status from 'http-status';

const showRecommendUser = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(status.BAD_REQUEST).send();
  try {
    const recommendUserInfo = await User.find().sort({ _id: -1 }).limit(3).exec();
    if (recommendUserInfo == undefined) return res.sendStatus(status.NOT_FOUND);
    res.status(status.OK).send(recommendUserInfo);
  } catch (e) {
    res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
};

export { showRecommendUser };
