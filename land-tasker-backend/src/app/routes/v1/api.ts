import express from 'express';
const router = express.Router();
import { authenticationTokenMiddleware } from '../../middleware/auth';
import { showHelloWorld } from '../../controllers/v1/helloWorld';
import { createUser, deleteOneUser, showOneUser, updateUser } from '../../controllers/v1/user/user';
import {
  createComment,
  deleteComment,
  showComment,
  updateComment,
} from '../../controllers/v1/comment/comment';
import { showPost, createPost, updatePost, deletePost } from '../../controllers/v1/post/post';
import { registerUser, activateUser } from '../../controllers/v1/register/register';
import { loginUser } from '../../controllers/v1/login/login';
import { forgetPassword, resetPassword } from '../../controllers/v1/resetPassword/resetPassword';
import { authenticationEmailTokenMiddleware } from '../../middleware/forgetPasswordAuth';
import {
  showReview,
  createReview,
  updateReview,
  deleteReview,
} from '../../controllers/v1/review/review';
import { showRecommendUser } from '../../controllers/v1/recommendUser/recommendUser';

router.get('/hello', showHelloWorld);

router.post('/register', registerUser);
router.put('/register/:activationCode', activateUser);

router.post('/user/forgetPassword', forgetPassword);
router.put('/user/forgetPassword', authenticationEmailTokenMiddleware, resetPassword);

router.post('/login', loginUser);

router.get('/user/recommend', showRecommendUser);

router.get('/user/:id', showOneUser);
router.post('/user', createUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteOneUser);

router.get('/user/:id/comment', showComment);
router.post('/user/:id/comment', createComment);
router.put('/user/:id/comment/:commentId', updateComment);
router.delete('/user/:id/comment/:commentId', deleteComment);

router.get('/user/:id/post', showPost);
router.post('/user/:id/post', createPost);
router.put('/user/:id/post/:postId', updatePost);
router.delete('/user/:id/post/:postId', deletePost);

router.get('/user/:id/review', showReview);
router.post('/user/:id/review', createReview);
router.put('/user/:id/review/:reviewId', updateReview);
router.delete('/user/review/:reviewId', deleteReview);

export default router;
