const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is missing",
      });
    }

    //verify tocken
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
      console.log("--------------------------------------------------------");
      console.log("payload",payload);

      next();
    } catch (error) {
      console.log(error);

      return res.status(401).json({
        success: false,
        message: "Token is invalid or expired",
      });
    }
  } catch (error) {
    console.log(error);
   return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

exports.isBuyer = async (req, res, next) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({
        success: false,
        message: "This route is protected for buyer",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

exports.isSeller = async (req, res, next) => {
  try {
    
    
    if (req.user.role !== "seller") {
     return res.status(403).json({
        success: false,
        message: "This route is protected for seller",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};
