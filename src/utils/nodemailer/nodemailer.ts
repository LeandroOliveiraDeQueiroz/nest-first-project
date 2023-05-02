import * as nodemailer from 'nodemailer';
import { IEmailOptions } from './nodemailer.types';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

const createEmailOptions = ({ receiver, subject, text }: IEmailOptions) => {
  return {
    from: process.env.EMAIL,
    to: receiver,
    subject: subject,
    text: text,
  };
};

export { createTransporter, createEmailOptions };
