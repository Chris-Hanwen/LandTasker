import { Request, Response } from 'express';
import User from '../../../model/user';
import { validationResult } from 'express-validator';
import status from 'http-status';
import { randomStringGenerator } from '../../../utils/randomStringGenerator';

const showReview = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(status.BAD_REQUEST).send();
  const userId = req.params.id;
  try {
    const userInfo = await User.findById(userId);
    if (userInfo == undefined) return res.sendStatus(status.NOT_FOUND); // return error if the Id is incorrect
    res.send(userInfo.reviews);
  } catch (e) {
    res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
};

const createReview = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(status.BAD_REQUEST).send();
  const userId = req.params.id;
  const reviewId = randomStringGenerator();
  const { reviewerName, serviceReview, serviceRate } = req.body;
  const time = new Date();
  try {
    const newReview = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $push: {
          reviews: { reviewId, reviewerName, serviceReview, serviceRate, userId, time },
        },
      },
      { new: true },
    );
    if (!newReview) {
      res.sendStatus(status.NOT_FOUND);
      return;
    }
    res.sendStatus(status.CREATED);
  } catch (e) {
    res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
};

const updateReview = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(status.BAD_REQUEST).send();
  const { id: userId, reviewId } = req.params;
  const { serviceReview, serviceRate, reviewerName } = req.body;
  const time = new Date();
  const checkReviewExist = await User.findOne({ user: userId, 'reviews.reviewId': reviewId });
  if (checkReviewExist == undefined) return res.sendStatus(status.NOT_FOUND);
  try {
    const updateUserReview = await User.findOneAndUpdate(
      { user: userId, 'reviews.reviewId': reviewId },
      {
        $set: {
          'reviews.$': {
            reviewId,
            reviewerName,
            serviceReview,
            serviceRate,
            userId,
            time,
          },
        },
      },
      { new: true },
    ).exec();

    if (!updateUserReview) {
      res.sendStatus(status.BAD_REQUEST);
      return;
    }
    res.send(updateUserReview.reviews);
  } catch (e) {
    res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
};

const deleteReview = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(status.BAD_REQUEST).send();
  const { reviewId } = req.params;
  const checkReviewExist = await User.findOne({ 'reviews.reviewId': reviewId });
  if (checkReviewExist == undefined) return res.sendStatus(status.NOT_FOUND);

  try {
    const deleteUserReview = await User.findOneAndUpdate(
      { 'reviews.reviewId': reviewId },
      { $pull: { reviews: { reviewId } } },
      { new: true },
    );
    if (!deleteUserReview) {
      res.sendStatus(status.BAD_REQUEST);
      return;
    }
    res.sendStatus(status.ACCEPTED);
  } catch (e) {
    res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
};

export { showReview, createReview, updateReview, deleteReview };
