const userschema = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { SendMail, otPmailSend } = require("../utils/signinmail");
const generateOTP = require("../utils/otpGenrate");

exports.signin = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "please fillup all details",
    });
  }
  try {
    const user = await userschema.findOne({ email });

    if (user) {
      return res.status(409).json({
        success: false,
        message: "User is already exist , please go to login",
      });
    } else {
      let hashedpassword;
      try {
        hashedpassword = await bcrypt.hash(password, 10);
        if (!hashedpassword) {
          return res.status(400).json({
            success: false,
            message: "password is not hashed",
          });
        }
      } catch (error) {
        return res.status(304).json({
          success: false,
          message: "Error in hashing",
        });
      }

      const otp = generateOTP();
      if (!otp) {
        return res.status(500).json({
          success: false,
          message: "otp is not genrated",
        });
      }

      const sendmail = SendMail(email, otp);

      if (!sendmail) {
        return res.status(503).json({
          success: false,
          message: "mail is not sended",
        });
      }

      const response = await userschema.create({
        name,
        email,
        password: hashedpassword,
        role,
        otp: otp,
      });

      return res.status(200).json({
        success: true,
        message: "Signin details are complately fillup,Go for otp verification",
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.otpverification = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userschema.findOne({ email }).select("name email role otp");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const now = Date.now();

    const otpExpires = now - new Date(user.otpCreatedAt).getTime();

    if (otpExpires > 40 * 1000) {
      user.otp = null;
      user.otpCreatedAt = null;
      user.save();
      return res.status(400).json({
        success: false,
        message: "OTP has expired,click resend otp",
      });
    }

    if (otp !== user.otp) {
      return res.status(401).json({
        success: false,
        message: "Enter valid otp",
      });
    } else {
      user.isValid = true;
      user.save();

      const mailsend = SendMail(
        email,
        `<h1>Hi ${user.name},<h1>

     <p> We're letting you know that you just signed in to your account on [E-commerce Website].</p>`,
        `SignIn successfull`
      );

      if (!mailsend) {
        return res.status(400).json({
          success: false,
          message: "mail is not sended",
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
        message: "signIn successfully",
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userschema.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOTP();
    if (!otp) {
      return res.status(500).json({
        success: false,
        message: "otp is not genrated",
      });
    } else {
      if (user.otp !== null) {
        user.otp = otp;
        user.otpCreatedAt = Date.now();
        user.save();
      } else {
        user.otp = otp;
        user.otpCreatedAt = Date.now();
        user.save();
      }
    }

    const sendmail = SendMail(email, `your otp is ${otp}`, `otp received`);

    if (!sendmail) {
      return res.status(503).json({
        success: false,
        message: "mail is not sended",
      });
    }

    return res.status(200).json({
      success: true,
      message: "otp resend successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "plese enter full details",
      });
    }
    const user = await userschema.findOne({ email });
    
    if (user.isValid === "false") {
      return res.status(401).json({
        success: false,
        message: "you missing otp verification,please retry otp verification",
      });
    }
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user does not exist signin first",
      });
    } 

    

    if (await !bcrypt.compare(password, user.password)) {
      res.status(400).json({
          success: false,
          message: "Enter valid password",
        });
       
      } else {
         const payload = {
       email: user.email,
       id: user._id,
       role: user.role,
     };

     const token = jwt.sign(payload, process.env.JWT_SECRET, {
       expiresIn: "7d",
     });
     console.log("token:", token);
     user.token = token;
     user.password = undefined;

     return res
       .cookie("token", token, {
         maxAge: 15 * 60 * 60 * 1000,
         httpOnly: true,
       })
       .status(200)
       .json({
         success: true,
         message: "successfull login",
         token,
       });
      }
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.logout = (req, res) => {
  try {
      return res.clearCookie("token").status(200).json(
      {
        success: true,
        message: "Logged out successfully"
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    //here to send otp using resend otp function and otpverification function
    const { email, otp, password } = req.body;
    if (!email || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "enter full details",
      });
    }
    

    const user = await userschema.findOne({ email })
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "can't get user",
      });
    }

    const now = Date.now();

    const otpExpires = now - new Date(user.otpCreatedAt).getTime();

    if (otpExpires > 40 * 1000) {
      user.otp = null;
      user.otpCreatedAt = null;
      user.save();
      return res.status(400).json({
        success: false,
        message: "OTP has expired,click resend otp",
      });
    }

    if (otp !== user.otp) {
      return res.status(401).json({
        success: false,
        message: "Enter valid otp",
      });
    }
   const hashedpassword = await bcrypt.hash(password, 10);
    if (!hashedpassword) {
      return res.status(400).json({
        success: false,
        message:"password is not hashed"
      })
    }

    const changePassword = await userschema.findByIdAndUpdate({ _id: user.id }, { password: hashedpassword });

    if (!changePassword) {
       return res.status(400).json({
         success: false,
         message: "password is not changed ",
       }); 
    }

    return res.status(200).json({
      success: true,
      message: "password changed successfully"
    });
    

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

exports.resetPassword = async (req, res) => {

  try {
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Can't get user id",
      });
    }

    const { password, newPassword } = req.body;
    if (!password || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "plese enter full details",
      });
    }
    const user = await userschema.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Can't get user",
      });
    }
    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(401).json({
        success: false,
        message: "password is not matched",
      });
    }

    const hashedpassword =await bcrypt.hash(newPassword, 10);
     if (!hashedpassword) {
       return res.status(400).json({
         success: false,
         message: "password is not hashed",
       });
    }
    
    const updateuser = await userschema.findByIdAndUpdate({ _id: userId }, { password: hashedpassword });
    if (!updateuser) {
      return res.status(400).json({
        success: false,
        message: "password is not hashed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "password changed successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }

}
