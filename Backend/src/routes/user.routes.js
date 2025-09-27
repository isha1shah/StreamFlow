
import express from "express";
import { 
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory
} from "../controllers/user.controller.js";

import { uploadImage } from "../middlewares/multer.middleware.js"; 
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ------------------ PUBLIC ROUTES ------------------
router.post(
  "/register",
  uploadImage.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  registerUser
);

router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

// ------------------ PROTECTED ROUTES ------------------
router.post("/logout", verifyJWT, logoutUser);
router.post("/change-password", verifyJWT, changeCurrentPassword);

// Get current logged-in user
router.get("/me", verifyJWT, getCurrentUser);

// Update account details (fullName, email, avatar, cover)
router.patch(
  "/me",
  verifyJWT,
  uploadImage.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  updateAccountDetails
);

// -------------------- UPDATE AVATAR ONLY --------------------
router.patch(
  "/me/avatar",
  verifyJWT,
  uploadImage.single("avatar"),
  updateUserAvatar
);

// -------------------- UPDATE COVER IMAGE ONLY --------------------
router.patch(
  "/me/cover",
  verifyJWT,
  uploadImage.single("coverImage"),
  updateUserCoverImage
);

// Channel profile and watch history
router.get("/c/:username", verifyJWT, getUserChannelProfile);
router.get("/history", verifyJWT, getWatchHistory);

export default router;
