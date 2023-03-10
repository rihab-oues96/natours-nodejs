const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    /********************************
    // send emails using gmail service 
    // service: 'Gmail',
    // auth: {
    //   user: process.env.EMAIL_USERNAME,
    //   pass: process.env.EMAIL_PASSWORD,
    // },
    // // activate in gmail "less secure app" option 
    *********************************/
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // define email options
  const mailOptions = {
    from: 'rihab <rihab@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.text,
  };

  // send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
