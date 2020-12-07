import { createTransport } from 'nodemailer';

import { environment } from '../config';

export const transporter = createTransport({
  service: environment.mailerService,
  auth: {
    user: environment.mailerEmail,
    pass: environment.mailerPassword
  },
  tls: {
    rejectUnauthorized: false
  }
});
