import { transporter, environment } from '../config';

/**
 * Send mailer helper
 * @param email 
 * @param id 
 * @param type 
 */
const sendVerificationMail = async (email: string, id: string, type: string) => {

  let subject: string = "";
  switch (type) {
    case "PASSWORD_CHANGE":
      subject = "Password change request";
      break;
    case "SIGN_UP":
      subject = "User verification";
      break;
    default:
      break;
  }

  const mailOptions: any = {
    from: environment.mailerEmail,
    to: email,
    subject,
    text: `Your ${subject} code is ${id}`
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
