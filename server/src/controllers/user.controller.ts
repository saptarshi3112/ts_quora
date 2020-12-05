import {
  Request,
  Response
} from 'express';

import { Authentication, User } from '../models';
import { UserSchema } from '../schema/user.schema';
import { UserHelper } from '../helpers';
import { statusMessage } from '../config';

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
        // get token.
        const token: string = await UserHelper.createToken(userFound);
        return res.json({
          ...statusMessage.USER200,
          data: {
            token,
            user: userFound
          }
        })
      }
    }
  } catch (ex) {
    return res.json({ ...statusMessage.SERVER500, error: ex.message });
  }
};

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

      const verificationCode: string = await UserHelper.generateVerificationTokenAndSendMail(newUser._id, newUser.email);

      return res.json({
        ...statusMessage.USER200,
        code: verificationCode
      });
    }
  } catch (ex) {
    return res.json({ ...statusMessage.SERVER500, error: ex.message });
  }
};

const userVerification = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      code
    } = req.body;
    const authFound: any = await Authentication.findById(code);
    if (authFound) {
      if (authFound.authenticated) {
        res.json(statusMessage.USER403);
      } else {
        const userFound: any = await User.findById(authFound.user_id);
        if (!userFound) {
          return res.json(statusMessage.USER404);
        } else {
          userFound.is_verified = true;
          authFound.authenticated = true;
          await userFound.save();
          await authFound.save();
          const token: string = await UserHelper.createToken(userFound);
          return res.json({
            ...statusMessage.USER200,
            data: {
              token,
              user: userFound
            }
          })
        }
      }
    } else {
      res.json(statusMessage.USER403);
    }
  } catch (ex) {
    return res.json({ ...statusMessage.SERVER500, error: ex.message });
  }
};

export const UserController = {
  userLogin,
  userRegister,
  userVerification
};
