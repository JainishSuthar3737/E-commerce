const cloudinary = require("cloudinary").v2;
async function UploadCloudinary(file, folder, quality) {
  const options = { folder };
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = "auto";

  return await cloudinary.uploader.upload(file.tempFilePath, options);
}
module.exports = UploadCloudinary;
