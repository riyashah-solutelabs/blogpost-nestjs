import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendWelcomeEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: 'amp@gmail.com',
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendResetPasswordEmail(to: string,subject: string, resetLink: string) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: 'amp@gmail.com',
      to,
      subject,
      html : resetLink,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
