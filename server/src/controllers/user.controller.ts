import { Request, Response } from 'express';

import { User, LoginAuthentication } from '../models';
import { UserHelper, UtilityHelper } from '../helpers';
import { statusMessage } from '../config';

import { UserSchema } from '../schema/user.schema';
import { LoginAuthenticationSchema } from '../schema/login_authentication.schema';

/**
 * User login
 * @param req
 * @param res
 * @returns {Promise}
 */
const userLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const user: UserSchema = req.body;
    const userFound: UserSchema = await User.findOne({ email: user.email }).lean();
    if (!userFound) {
      // user not found.
      return res.json(statusMessage.USER404);
    } else {
      if (!userFound.is_verified)
        return res.json(statusMessage.USER403);
      const passwordMatch: boolean = await UserHelper.verifyPassword(user.password, userFound.password);
      if (!passwordMatch) {
        // invalid password.
        res.json(statusMessage.USER403);
      } else {

        // mark user as logged in
        const authLogin: any = await LoginAuthentication.findOne({ user_id: userFound._id });
        authLogin.is_logged = true;
        authLogin.last_logged_in = new Date();
        await authLogin.save();

        // get token.
        const token: string = await UserHelper.createToken(userFound);
        return res.json({
          ...statusMessage.USER200,
          data: { token, user: { ...userFound, password: null } }
        })
      }
    }
  } catch (ex: any) {
    res.json(UtilityHelper.errorHandler(ex));
  }
};

/**
 * User registration
 * @param req
 * @param res
 * @returns {Promise}
 */
const userRegister = async (req: Request, res: Response): Promise<any> => {
  try {
    const user: UserSchema = req.body;
    const userFound: UserSchema = await User.findOne({ email: user.email }).lean();
    if (userFound) {
      res.json(statusMessage.USER409);
    } else {
      const newUser = new User({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      });
      newUser.password = await UserHelper.hashPassword(user.password);
      await newUser.save();
      await UserHelper.generateVerificationTokenAndSendMail(newUser._id, newUser.email, 'SIGN_UP');
      return res.json({
        ...statusMessage.USER201,
        status: "Verification sent to user email"
      });
    }
  } catch (ex: any) {
    res.json(UtilityHelper.errorHandler(ex));
  }
};

/**
 * Verify a registered user
 * @param req
 * @param res
 * @returns {Promise}
 */
const userVerification = async (req: Request, res: Response): Promise<any> => {
  try {
    const { code } = req.body;
    const authFound: any = await UserHelper.verifyAuthRequest(code, 'SIGN_UP');
    if (authFound && authFound.status_code === '200') {
      const userFound: any = await User.findById(authFound.user_id);
      if (!userFound) {
        return res.json(statusMessage.USER404);
      } else {
        // verify the user.
        userFound.is_verified = true;
        // create a new user auth model.
        await new LoginAuthentication({
          user_id: userFound._id,
          is_logged: true
        }).save();

        await userFound.save();

        const token: string = await UserHelper.createToken(userFound);
        return res.json({
          ...statusMessage.USER200,
          data: { token, user: { ...userFound._doc, password: null } }
        })
      }
    } else {
      res.json(authFound);
    }
  } catch (ex: any) {
    res.json(UtilityHelper.errorHandler(ex));
  }
};

/**
 * User request change of password with token
 * @param req
 * @param res
 * @returns {Promise}
 */
const requestPasswordChange = async (req: Request, res: Response): Promise<any> => {
  try {
    const { user_id, email } = req.body;
    const userFound: UserSchema = await User.findOne({ _id: user_id, email });
    if (!userFound) {
      return res.json(statusMessage.USER404);
    } else {
      // user found. auth can be made.
      await UserHelper.generateVerificationTokenAndSendMail(userFound._id, userFound.email, 'PASSWORD_CHANGE');
      return res.json(statusMessage.USER201);
    }
  } catch (ex) {
    return res.json(UtilityHelper.errorHandler(ex));
  }
};

/**
 * Reset user password after confirmation
 * @param req
 * @param res
 * @returns {Promise}
 */
const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { code, password, confirm_password } = req.body;
    const authFound: any = await UserHelper.verifyAuthRequest(code, 'PASSWORD_CHANGE');
    if (authFound && authFound.status_code === '200') {
      if (password === confirm_password) {
        // update the user password.
        const userFound = await User.findOne({ _id: authFound.user_id, is_verified: true });
        userFound.password = await UserHelper.hashPassword(password);
        await userFound.save();
        return res.json(statusMessage.USER202);
      } else {
        return res.json({
          ...statusMessage,
          message: "Password does not match"
        });
      }
    } else {
      return res.json(authFound);
    }
  } catch (ex: any) {
    return res.json(UtilityHelper.errorHandler(ex));
  }
};

/**
 * Logout user from system
 * @param req
 * @param res
 * @returns {Promise}
 */
const userLogout = async (req: Request, res: Response): Promise<any> => {
  try {
    const loginAuth: LoginAuthenticationSchema = req.body;
    const userFound: UserSchema | any = await User.findById(loginAuth.user_id);
    if (!userFound) {
      return res.json(statusMessage.USER404);
    } else {
      const loginAuthFound: LoginAuthenticationSchema | any = await LoginAuthentication.findOne({
        user_id: loginAuth.user_id
      });
      if (!loginAuthFound) {
        return res.json(statusMessage.AUTH404);
      } else {

        loginAuthFound.is_logged = false;
        loginAuthFound.last_logged_out = new Date();
        await loginAuthFound.save();

        return res.json(statusMessage.LOGOUT200);
      }
    }
  } catch (ex: any) {
    return res.json(UtilityHelper.errorHandler(ex));
  }
};

export const UserController = {
  userLogin,
  userRegister,
  userVerification,
  requestPasswordChange,
  resetPassword,
  userLogout
};
