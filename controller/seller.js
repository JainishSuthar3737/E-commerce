// seller: sell-item, delete-item, edit-item, view-item
const item = require("../model/item");
const User = require("../model/user")
const UploadCloudinary = require("../utils/cloudinaryUpload");

exports.sellItem= async(req,res)=>{
   try{
     const {
       title,
       description,
       price,
       review,
       likes,
       available_item,
       discount,
     } = req.body;

       if (!req.files) {
         return res.status(400).json({
           success: false,
           message: "No file uploaded",
         });
       }
     const file = req.files.file;
     console.log(file);

     //validation

     const supportedfile = [
       "jpg",
       "jpeg",
       "png",
       "mp4",
       "avi",
       "mov",
       "webm",
       "flv",
       "webp",
     ];
     const Filetype = file.name.split(".")[1].toLowerCase();
    //  console.log(file1.name.split(".").pop().toLowerCase()); // 

     if (!supportedfile.includes(Filetype)) {
      return res.status(400).json({
        success: false,
        message: "file is not supported",
      });
     }

     const response = await UploadCloudinary(file, "codehelp");

     if (!response) {
       return res.status(500).json({
         success: false,
         message: "file is not Uploded on cloudinary server",
       });
     }

     const fileUpload = await item.create({
       title,
       description,
       price,
       review,
       likes,
       available_item,
       discount,
       imageUrl: response.secure_url,
     });

     if (!fileUpload) {
       return res.status(501).json({
         success: false,
         message: "file entry is not created in database",
       });
     }

    return res.status(200).json({
      success: true,
      data: fileUpload,
      message: "item is ready for sell",
    });
   }catch(error){
    console.log(error);
   return res.status(500).json({
     success: false,
     message: "Server Error",
   });
  
   }
    
}

exports.deleteItem = async (req, res) => {
  try {
   const {id} = req.params;

    const response = await item.findByIdAndDelete({ _id: id });
    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Item not found. Deletion failed",
      });
    }

    const updateUser=await User.updateMany({ role: "buyer", $or:[{cart:id},{wishlist:id},{like:id}],},{$pull:{cart:id,wishlist:id,like:id}})

    if (!updateUser) {
      return res.status(400).json({
        success: false,
        message: "user is not updated",
      });
    }
  

   return res.status(200).json({
     success: true,
     data: response,
     message: "item Deleted",
   });
  } catch (error) {
   return res.status(500).json({
     success: false,
     message: "Server Error",
   });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const {id}= req.params;
    const {
      title,
      description,
      price,
      review,
      likes,
      available_item,
      discount,
    } = req.body;

    const response = await item.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        price,
        review,
        likes,
        available_item,
        discount,
      },
      { new: true }
    );
       if (!response) {
         return res.status(404).json({
           success: false,
           message: "Item not found. Updation failed",
         });
       }

   return res.status(200).json({
     success: true,
     data: response,
     message: "item is updated",
   });
  } catch (error) {
    console.log(error);
    
   return res.status(500).json({
     success: false,
     message: "Server Error",
   });
  }
};

exports.viewItem = async (req, res) => {
  try {
    const{ id }=req.params;
    
    const response = await item.findById(id);
    console.log(response);
    
     if (!response) {
       return res.status(404).json({
         success: false,
         message: "Item not found.",
       });
     }
   return res.status(200).json({
     success: true,
     data: response,
     message: "item is here",
   });
  } catch (error) {
    console.log(error);
    
   return res.status(500).json({
     success: false,
     message: "Server Error",
   });
  }
};

exports.listItem = async (req, res) => {
  try {
    const { order,search,page=1,limit=5 } = req.query; // Get sorting order from query (asc or desc)
    const sortOrder = order === "desc" ? -1 : 1; // Default: Ascending (A-Z)

    let filter = {};

    if (search) {
      filter.title = { $regex  :search, $options:"i"}
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const response = await item.find(filter).sort({price:sortOrder}).skip(skip).limit(limitNumber);
    console.log(response);

    // const totalItems = await item.countDocuments(filter);
    // const totalPages = Math.ceil(totalItems / limitNumber);

    if (!response) {
      return res.status(404).json({
        success: false,
        message:"item is not found",
      })
    }
   return res.status(200).json({
     success: true,
     data: response,
     message: "ALL item is here",
   });
  } catch (error) {
    console.log(error);

   return res.status(500).json({
     success: false,
     message: "Server Error",
   });
  }
};