
import { Router } from "express";
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment, // new
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ➝ Public Route: anyone can see comments
// Example: GET /api/v1/comments?video=videoId OR ?tweet=tweetId
router.get("/", getComments);

// ➝ Protected Routes: only logged-in users
router.post("/", verifyJWT, createComment);             // Create new comment
router.put("/:comment", verifyJWT, updateComment);      // Update comment by ID
router.delete("/:comment", verifyJWT, deleteComment);   // Delete comment by ID

// ➝ Like/unlike a comment
// Example: POST /api/v1/comments/:commentId/like
router.post("/:commentId/like", verifyJWT, likeComment);

export default router;
