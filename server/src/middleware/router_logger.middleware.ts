import {
  Request,
  Response,
  NextFunction
} from 'express';

/**
 * Logs the url and the method of the request
 * @param req
 * @param res
 * @param next
 */
export const routerLogger = (req: Request, res: Response, next: NextFunction): void => {
  const url = req.protocol + "://" + req.headers.host + req.baseUrl + req.url;
  console.log(url + " | " + req.method);
  next();
}
