// test-cloudinary.js
import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

// Dynamically import cloudinary and configure it immediately
import("./config/cloudinary.js").then((module) => {
  const cloudinary = module.default;

  // Configure cloudinary with environment variables
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  console.log("Cloudinary Config (after import):", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET ? "[REDACTED]" : undefined,
  });

  cloudinary.uploader.upload(
    "C:\\Users\\Tina\\Pictures\\bg2.jpg", // Use double backslashes for Windows
    { folder: "social_media_app" },
    (error, result) => {
      if (error) console.error("Cloudinary Upload Error:", error);
      else console.log("Uploaded:", result.secure_url);
    }
  );
}).catch((err) => {
  console.error("Error importing or configuring cloudinary:", err);
});