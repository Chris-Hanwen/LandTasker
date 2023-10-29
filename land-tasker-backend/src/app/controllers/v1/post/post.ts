import { Request, Response } from 'express';
import User from '../../../model/user';
import { validationResult } from 'express-validator';
import status from 'http-status';
import { randomStringGenerator } from '../../../utils/randomStringGenerator';

const showPost = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(status.BAD_REQUEST).send();
  const userId = req.params.id;
  try {
    const showOneUserInfo = await User.findById(userId).exec();
    if (showOneUserInfo == undefined) return res.sendStatus(status.NOT_FOUND);
    res.send(showOneUserInfo.posts);
  } catch (e) {
    res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
};

const createPost = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(status.BAD_REQUEST).send();
  const userId = req.params.id;
  const postId = randomStringGenerator();
  const { userPost } = req.body;
  const time = new Date();
  try {
    const newPost = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $push: {
          posts: { userId, postId, userPost, time },
        },
      },
      { new: true },
    );
    if (!newPost) {
      res.sendStatus(status.NOT_FOUND);
      return;
    }
    res.sendStatus(status.CREATED);
  } catch (e) {
    res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
};

const updatePost = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(status.BAD_REQUEST).send();
  const { id, postId } = req.params;
  const { userPost } = req.body;
  const time = new Date();
  try {
    const checkPostExist = await User.findOne({ _id: id, 'posts.postId': postId });
    if (checkPostExist == undefined) return res.sendStatus(status.NOT_FOUND);
    const updateUserPost = await User.findOneAndUpdate(
      { _id: id, 'posts.postId': postId },
      {
        $set: {
          'posts.$': {
            id,
            postId,
            userPost,
            time,
          },
        },
      },
      { new: true },
    ).exec();
    if (!updateUserPost) {
      res.sendStatus(status.BAD_REQUEST);
      return;
    }
    res.send(updateUserPost.posts);
  } catch (e) {
    res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
};

const deletePost = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(status.BAD_REQUEST).send();
  const { postId } = req.params;
  try {
    const checkPostExist = await User.findOne({ 'posts.postId': postId });
    if (checkPostExist == undefined) return res.sendStatus(status.NOT_FOUND);
    const deleteUserPost = await User.findOneAndUpdate(
      { 'posts.postId': postId },
      { $pull: { posts: { postId } } },
      { new: true },
    );
    if (!deleteUserPost) {
      res.sendStatus(status.BAD_REQUEST);
      return;
    }
    res.sendStatus(status.ACCEPTED);
  } catch (e) {
    res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
};

export { showPost, createPost, updatePost, deletePost };
