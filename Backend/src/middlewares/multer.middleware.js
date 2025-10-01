

import multer from "multer";
import path from "path";
import fs from "fs";

// 1️Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";

    // Create uploads folder if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // e.g., 1694412345678-avatar.png
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// 2️ File filter (accept only images)
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // accept
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// 3️ File filter (for videos)
const videoFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true); // accept
  } else {
    cb(new Error("Only video files are allowed"), false);
  }
};

// 4️Export upload functions
export const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadVideo = multer({
  storage,
  fileFilter: videoFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

export const upload = multer({ storage });

// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const uploadDir = path.resolve("uploads");

// // make sure uploads folder exists
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   },
// });

// // Filters
// const imageFileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) cb(null, true);
//   else cb(new Error("Only image files are allowed"), false);
// };

// const videoFileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("video/")) cb(null, true);
//   else cb(new Error("Only video files are allowed"), false);
// };

// // Middlewares
// export const uploadImage = multer({
//   storage,
//   fileFilter: imageFileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// });

// export const uploadVideo = multer({
//   storage,
//   fileFilter: videoFileFilter,
//   limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
// });

// // fallback generic upload (any file)
// export const upload = multer({ storage });
