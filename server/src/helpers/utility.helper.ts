import { statusMessage } from '../config';
 
const docToJSON = (doc: any): JSON => {
  return JSON.parse(JSON.stringify(doc));
};

const errorHandler = (ex: Error) => {
  return {
    ...statusMessage.SERVER500,
    error: ex.message
  };
};

export const UtilityHelper = {
  docToJSON,
  errorHandler
};
