import { statusMessage } from '../config';

/**
 * Convert mongo doc to JSON
 * @param doc 
 */
const docToJSON = (doc: any): JSON => {
  return JSON.parse(JSON.stringify(doc));
};

/**
 * Handle error message
 * @param ex 
 */
const errorHandler = (ex: Error): JSON | object => {
  return {
    ...statusMessage.SERVER500,
    error: ex.message
  };
};

export const UtilityHelper = {
  docToJSON,
  errorHandler
};
