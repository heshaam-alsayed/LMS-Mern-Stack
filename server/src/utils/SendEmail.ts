import { createTransport } from "nodemailer";
import path from "path";
import ejs from "ejs";
import { log } from "console";
import AppError from "./AppError";

export interface IEmailOptions {
  email: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

const sendEmail = async (options: IEmailOptions): Promise<void> => {
  try {
    // Gmail app passwords are shown with spaces - remove them to avoid login failures
    const smtpPassword = (process.env.SMTP_PASSWORD || "").replace(/\s/g, "");

    // 1. create transporter
    const transporter = createTransport({
      service: process.env.SMTP_SERVICE,
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_MAIL,
        pass: smtpPassword,
      },
    });

    // 2. build template path
    const templatePath = path.join(
      process.cwd(),
      "src",
      "mails",
      options.template,
    );
    console.log(templatePath);

    // 3. render ejs -> html
    const html = await ejs.renderFile(templatePath, options.data);

    // 4. send email
    await transporter.sendMail({
      from: process.env.SMTP_MAIL,
      to: options.email,
      subject: options.subject,
      html,
    });
  } catch (error: any) {
    console.error(" Email sending failed:", error?.message);

    if (
      error?.message?.includes("535") ||
      error?.message?.includes("Username and Password not accepted") ||
      error?.message?.includes("BadCredentials")
    ) {
      throw new AppError(
        "Email login failed: SMTP credentials (SMTP_MAIL / SMTP_PASSWORD) are invalid or expired. For Gmail, generate a new App Password at https://myaccount.google.com/apppasswords",
        400,
      );
    }

    throw new AppError(error?.message || "Failed to send email", 400);
  }
};

export default sendEmail;
