import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

//створюємо загальну функцію для відправки email користувачам
function sendMail(message) {
  return transport.sendMail(message);
}

export default { sendMail };
