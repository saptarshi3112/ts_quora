import { compareSync, hashSync, genSaltSync } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

import { UtilityHelper, MailHelper } from './index';
import { environment, statusMessage } from '../config';
import { Authentication } from '../models';
import { AuthSchema } from '../schema/auth.schema';

/**
 * Hash the password for user
 * @param password
 * @returns {Promise}
 */
const hashPassword = (password: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const salt: string = genSaltSync(10);
      const hash: string = hashSync(password, salt);
      resolve(hash)
    } catch (ex: any) {
      console.log('hashPassword', ex.message);
      reject(ex);
    }
  });
};

/**
 * Verify users password for login
 * @param password
 * @param hash
 * @returns {Promise}
 */
const verifyPassword = (password: string, hash: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const match: boolean = compareSync(password, hash);
      resolve(match);
    } catch (ex: any) {
      console.log('verifyPassword', ex.message);
      reject(ex);
    }
  });
};

/**
 * Create a jwt token depending on user details
 * @param payload
 * @returns {Promise}
 */
const createToken = (payload: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const jsonPayload: JSON | any = UtilityHelper.docToJSON(payload);
      const token: string = sign(jsonPayload, environment.jwtSecret, {
        expiresIn: '1d'
      });
      resolve(token);
    } catch (ex: any) {
      console.log('createToken', ex.message);
      reject(ex);
    }
  });
};

/**
 * Verify a JWT token
 * @param token
 * @returns {Promise}
 */
const verifyToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const data: any = verify(token, environment.jwtSecret);
      resolve(data);
    } catch (ex: any) {
      console.log('verifyToken', ex.message);
      reject(ex);
    }
  });
}

/**
 * Create a auth request and send the token via mail
 * @param _id
 * @param email
 * @param type
 * @returns {Promise}
 */
const generateVerificationTokenAndSendMail = (_id: string, email: string, type: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const auth: any = new Authentication({
        user_id: _id,
        request_type: type
      });
      await auth.save();
      MailHelper.sendVerificationMail(email, auth._id, type);
      resolve(true);
    } catch (ex: any) {
      console.log('generateVerificationTokenAndSendMail', ex.message);
      reject(ex.message);
    }
  });
};

/**
 * Verify a auth request made by user
 * @param code
 * @param type
 * @returns {Promise}
 */
const verifyAuthRequest = (code: string, type: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const authFound: AuthSchema | any = await Authentication.findOne({
        _id: code,
        request_type: type,
        authenticated: false
      });
      if (!authFound) {
        resolve(statusMessage.USER403);
      } else {
        if (authFound.authenticated) {
          resolve(statusMessage.USER403);
        } else {
          // one auth request found. verify it.
          authFound.authenticated = true;
          await authFound.save();
          resolve({
            ...statusMessage.USER200,
            user_id: authFound.user_id
          });
        }
      }
    } catch (ex: any) {
      console.log('verifyAuthRequest', ex.message);
      reject(ex.message);
    }
  });
};

export const UserHelper = {
  hashPassword,
  verifyPassword,
  createToken,
  verifyToken,
  generateVerificationTokenAndSendMail,
  verifyAuthRequest
};
