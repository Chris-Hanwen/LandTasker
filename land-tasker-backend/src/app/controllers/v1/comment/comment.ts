import { Request, Response } from 'express';
import User from '../../../model/user';
import { validationResult } from 'express-validator';
import status from 'http-status';
import { randomStringGenerator } from '../../../utils/randomStringGenerator';

const showComment = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.sendStatus(status.OK);
  const userId = req.params.id;
  try {
    const showOneUserInfo = await User.findById(userId);
    if (showOneUserInfo == undefined) return res.sendStatus(status.NOT_FOUND);
    res.send(showOneUserInfo.comments);
  } catch (e) {
    res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
};

const createComment = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(status.BAD_REQUEST).send();
  const userId = req.params.id;
  const commentId = randomStringGenerator();
  const { userComment } = req.body;
  const time = new Date();
  try {
    const updateUserComment = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $push: {
          comments: { userComment, commentId, user: userId, time },
        },
      },
      { new: true },
    );
    if (!updateUserComment) {
      res.sendStatus(status.BAD_REQUEST);
      return;
    }

    res.send(updateUserComment.comments);
  } catch (e) {
    res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
};

const updateComment = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(status.BAD_REQUEST).send();
  const { id, commentId } = req.params;
  const { userComment } = req.body;
  const time = new Date();

  const checkCommentExist = await User.findOne({ user: id, 'comments.commentId': commentId });
  if (checkCommentExist == undefined) return res.sendStatus(status.NOT_FOUND);

  try {
    const updateUserComment = await User.findOneAndUpdate(
      { user: id, 'comments.commentId': commentId },
      {
        $set: {
          'comments.$': {
            userComment,
            commentId,
            user: id,
            time,
          },
        },
      },
      { new: true },
    ).exec();

    if (!updateUserComment) {
      res.sendStatus(status.BAD_REQUEST);
      return;
    }
    res.send(updateUserComment.comments);
  } catch (e) {
    res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
};

const deleteComment = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(status.BAD_REQUEST).send();
  const { id, commentId } = req.params;
  const checkCommentExist = await User.findOne({ user: id, 'comments.commentId': commentId });
  if (checkCommentExist == undefined) return res.sendStatus(status.NOT_FOUND);

  try {
    const deleteOneUserComment = await User.findOneAndUpdate(
      { user: id, 'comments.commentId': commentId },
      { $pull: { comments: { user: id, commentId } } },
      { new: true },
    );
    if (!deleteOneUserComment) {
      res.sendStatus(status.BAD_REQUEST);
      return;
    }
    res.send(deleteOneUserComment);
  } catch (e) {
    res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
};
export { showComment, createComment, updateComment, deleteComment };
