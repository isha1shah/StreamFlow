import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath, folder = "youtube_clone") => {
  if (!filePath) return null;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,           // optional folder in Cloudinary
      resource_type: "auto", // auto-detect file type
    });

    // Remove local file after upload
     if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    console.log("✅ File uploaded successfully:", result.secure_url);
    return result;  // result.url or result.secure_url
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error.message);

    // Remove local file if exists
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    throw new Error("Failed to upload file to Cloudinary");
  }
};

export { uploadOnCloudinary };



