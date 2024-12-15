import express from 'express';

import { userCtrl } from './controller';

import { activate } from '../../middleware/activate';
import { auth } from '../../middleware/auth';
import { authAdmin } from '../../middleware/authAdmin';
import { resetPassword } from '../../middleware/resetPassword';

export const userRouter = express.Router();

userRouter.route('/access_token').get(userCtrl.getAccessToken);

userRouter.route('/auth/register').post(userCtrl.register);

userRouter.route('/auth/login').post(userCtrl.login);

userRouter.route('/auth/logout').post(auth, userCtrl.logout);

userRouter.route('/deleteAccount').delete(auth, userCtrl.deleteAccount);

userRouter.route('/info').put(auth, userCtrl.updateUser);

userRouter.route('/').get(auth, authAdmin, userCtrl.getAllUsers);

userRouter.route('/getAdmins').get(auth, authAdmin, userCtrl.getAllAdmins);

userRouter.route('/deleteAccount').delete(auth, userCtrl.deleteAccount);

userRouter.route('/admin/:id').delete(auth, authAdmin, userCtrl.deleteUser);

userRouter.route('/auth/activate_account').get(activate, userCtrl.activate);

userRouter.route('/forgot-password').post(userCtrl.forgotPassword);

userRouter
    .route('/auth/reset-password/:reset_password_token')
    .put(resetPassword, userCtrl.resetPassword);

userRouter.route('/:id').get(userCtrl.getOne);
