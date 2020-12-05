import {
  createTransport,
} from 'nodemailer';

import { environment } from '../config';

const sendVerificationMail = async (email: string, id: string) => {

  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: environment.mailerEmail,
      pass: environment.mailerPassword
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: environment.mailerEmail,
    to: email,
    subject: 'User verification',
    text: `Your code is ${id}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


export const MailHelper = {
  sendVerificationMail
};
