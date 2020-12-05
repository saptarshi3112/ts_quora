import {
  compareSync,
  hashSync,
  genSaltSync
} from 'bcryptjs';

import {
  sign,
  verify
} from 'jsonwebtoken';

import { UtilityHelper, MailHelper } from './index';
import { environment } from '../config';
import { Authentication } from '../models';

const hashPassword = (password: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const salt = genSaltSync(10);
      const hash = hashSync(password, salt);
      resolve(hash)
    } catch (ex: any) {
      console.log('hashPassword', ex.message);
      reject(ex);
    }
  });
};

const verifyPassword = (password: string, hash: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const match = compareSync(password, hash);
      resolve(match);
    } catch (ex: any) {
      console.log('verifyPassword', ex.message);
      reject(ex);
    }
  });
};

const createToken = (payload: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const jsonPayload = UtilityHelper.docToJSON(payload);
      const token = sign(jsonPayload, environment.jwtSecret);
      resolve(token);
    } catch (ex: any) {
      console.log('createToken', ex.message);
      reject(ex);
    }
  });
};

const verifyToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const data = verify(token, environment.jwtSecret);
      resolve(data);
    } catch (ex: any) {
      console.log('verifyToken', ex.message);
      reject(ex);
    }
  });
}

const generateVerificationTokenAndSendMail = (_id: string, email: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const auth = new Authentication({
        user_id: _id
      });
      await auth.save();
      MailHelper.sendVerificationMail(email, auth._id);
      resolve(auth._id);
    } catch (ex: any) {
      console.log('generateVerificationTokenAndSendMail', ex.message);
      reject(ex.message);
    }
  });
};

export const UserHelper = {
  hashPassword,
  verifyPassword,
  createToken,
  verifyToken,
  generateVerificationTokenAndSendMail
};
