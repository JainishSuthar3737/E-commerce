const express = require("express");
const router = express();

const { signin, login,logout,otpverification ,sendOtp,forgotPassword,resetPassword} = require("../controller/auth");
const { sellItem, viewItem, updateItem,deleteItem ,listItem} = require("../controller/seller");
const { buyItem,reviewItem, addToCart, addToWish,likeItem } = require("../controller/buyer");
const { auth, isBuyer, isSeller} = require("../middleware/authe");
const { Profile, updateProfile,deleteProfile } = require("../controller/profile");


router.post("/signin", signin);
router.post("/otpverification", otpverification);
router.post("/sendOtp", sendOtp);
router.post("/login", login);
router.get("/logout", logout);
router.patch("/forgotPassword", forgotPassword);
router.patch("/resetPassword",auth, resetPassword);


router.post("/sellItem", auth, isSeller,sellItem);
router.delete("/deleteItem/:id", auth, isSeller, deleteItem);
router.patch("/updateItem/:id", auth, isSeller, updateItem);

router.get("/Profile", auth, Profile);
router.patch("/updateProfile", auth, updateProfile);
router.delete("/deleteProfile", auth, deleteProfile);


router.get("/listItem", listItem);
router.get("/viewItem/:id",viewItem);


router.post("/buyItem/:id", auth, isBuyer, buyItem);
router.post("/reviewItem/:id",auth,isBuyer, reviewItem);
router.post("/addToCart/:id", auth, isBuyer, addToCart);
router.post("/addToWish/:id", auth, isBuyer, addToWish);
router.post("/likeItem/:id", auth, isBuyer, likeItem);


router.get("/auth", auth,(req,res)=>{
    return res.status(200).json({
      success: true,
      message: "Authentication successfull",
    });
});
router.get("/isBuyer",auth, isBuyer,(req,res)=>{
    return res.status(200).json({
      success: true,
      message: "you are buyer",
    });
});
router.get("/isSeller",auth,isSeller,(req,res)=>{
    return res.status(200).json({
      success: true,
      message: "you are seller",
    });
});

module.exports = router;