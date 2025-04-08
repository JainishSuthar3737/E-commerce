const nodemailer = require("nodemailer");
const userschema = require("../model/user");
require("dotenv").config();

const SendMail = async (email, message, subject) => {
  try {
    const user = await userschema.findOne({ email });
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    //send MAIL

    let info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: subject,
      html: message,
    });
    console.log("info:", info);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


module.exports = { SendMail };