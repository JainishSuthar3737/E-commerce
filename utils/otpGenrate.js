// Function to generate OTP
const otpGenrate = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
  // return "000000";
};

module.exports = otpGenrate;