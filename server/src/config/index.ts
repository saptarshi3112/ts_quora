import { environment } from './environment.config';
import { dbInit } from './database.config';
import { statusMessage } from './status_message.config';
import { transporter } from './mail.config';

export {
  dbInit,
  environment,
  statusMessage,
  transporter
}
