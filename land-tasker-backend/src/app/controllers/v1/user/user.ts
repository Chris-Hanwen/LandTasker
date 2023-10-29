import { Request, Response } from 'express';
import User from '../../../model/user';
import { validationResult } from 'express-validator';

const showOneUser = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(400).send();
  const userId = req.params.id;
  try {
    const showOneUserInfo = await User.findOne({ _id: userId });
    if (showOneUserInfo == undefined) return res.status(422).send();
    res.send(showOneUserInfo);
  } catch (e) {
    res.status(500).send();
  }
};

const createUser = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(400).send();
  const newUserInfo = req.body;
  try {
    const newUser = await User.create({ ...newUserInfo });
    if (newUser) res.send('New user ok');
  } catch (e) {
    res.status(500).send();
  }
};

const updateUser = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(400).send();
  const userId = req.params.id;
  const userUpdateInfo = req.body;
  try {
    const updateUserFlag = await User.findByIdAndUpdate(
      { _id: userId },
      { ...userUpdateInfo },
      { new: true },
    );
    if (!updateUserFlag) {
      res.sendStatus(402);
      return;
    }
    res.send(updateUserFlag);
  } catch (e) {
    res.sendStatus(500);
  }
};

const deleteOneUser = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(400).send();
  const userId = req.params.id;
  const checkUserExist = await User.findById({ _id: userId });
  if (checkUserExist == undefined) return res.sendStatus(404);
  try {
    const deleteOneUserFlag = await User.findOneAndDelete({ _id: userId });
    if (!deleteOneUserFlag) return res.sendStatus(402);
    return res.sendStatus(204);
  } catch (e) {
    res.sendStatus(500);
  }
};
export { showOneUser, createUser, updateUser, deleteOneUser };
