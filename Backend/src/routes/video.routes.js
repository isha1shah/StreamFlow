import express from "express";
import { 
  uploadVideo, 
  getAllVideos, 
  getVideoById, 
  updateVideo, 
  deleteVideo 
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();
// 👉 Upload new video (protected route)
router.post(
  "/upload",
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
  uploadVideo
);

router.get("/", getAllVideos); // Accept query ?page=1&limit=10


// 👉 Get video by ID (public)
router.get("/:id", getVideoById);

// 👉 Update video (only owner)
router.patch("/:id", verifyJWT, updateVideo);

// 👉 Delete video (only owner)
router.delete("/:id", verifyJWT, deleteVideo);

export default router;

