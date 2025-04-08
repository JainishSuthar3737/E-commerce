const User = require("../model/user");

exports.Profile = async (req, res) => {
    try {
        const userId  = req.user.id;
        
         if (!userId) {
           return res.status(400).json({
             success: false,
             message: "Can't get user id",
           });
         }

        const profile = await User.findById(userId).select("name email role");
        if (!profile) {
          return res.status(400).json({
            success: false,
            message: "can't get profile",
          });
        }

        return res.status(200).json({
            success: true,
            Data: profile,
            message:"Profile is here"
       })
        
  
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "server error"
        });
    }
}

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({
      success: false,
      message: "please fillup all details",
    });
  
    }
    const userId = req.user.id;
  
   if (!userId) {
     return res.status(400).json({
       success: false,
       message: "Can't get user id",
     });
   }
    const response = await User.findByIdAndUpdate(
      { _id:userId },
      { name, email, role },
      { new: true }
    ).select('name email role');

    if (!response) {
      return res.status(400).json({
        success: false,
        message: "can't get response",
      });
    }
    
    return res.status(200).json({
      success: true,
      Data: response,
      message:"Profile updated"
    })
  
 }catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "server error"
        });
    }
}

exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Can't get user id",
      });
    }
    const response = await User.findByIdAndDelete({ _id: userId }).select(" name "); 

    if (!response) {
      return res.status(400).json({
        success: false,
        message: "can't get response,user not exist",
      });
    }

     return res.status(200).json({
       success: true,
       Data: response,
       message: "Profile Deleted,need new profile then go to signin",
     }); 
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
}


