import {
  Request,
  Response,
  NextFunction
} from 'express';

import { UserHelper } from '../helpers';
import { statusMessage } from '../config';
import { User } from '../models';
import { UserSchema } from '../schema/user.schema';

/**
 * Validate user requests if token or not
 * @param req 
 * @param res 
 * @param next 
 */
export const validateUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { token }: any = req.headers;
  const data: any = UserHelper.verifyToken(token);
  if (data && data._id) {
    const userFound: UserSchema = await User.findById(data._id);
    if (userFound && userFound.is_verified) {
      // allow user to pass.
      next();
    } else {
      return res.json(statusMessage.USER403);
    }
  } else {
    return res.json(statusMessage.REQUEST400);
  }
};
