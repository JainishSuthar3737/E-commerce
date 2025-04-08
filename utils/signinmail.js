const nodemailer = require("nodemailer");
const userschema = require("../model/user");
require("dotenv").config();

const SigninMail = async (email) => {
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
      subject: `SignIn successfull`,
      html: `<h1>Hi ${user.name},<h1>

     <p> We're letting you know that you just signed in to your account on [E-commerce Website].</p>`,
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

const otPmailSend = async (email, otp) => {
  try {
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
      subject: `Otp`,
      html: `<h1>your otp is :${otp}</p>`,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = { SigninMail, otPmailSend };