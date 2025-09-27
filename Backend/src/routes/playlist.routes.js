import { Router } from "express";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ➝ Protected routes (need login)
router.post("/", verifyJWT, createPlaylist);                // Create a playlist
router.get("/user/:userId", verifyJWT, getUserPlaylists);   // Get all playlists of a user
router.get("/:playlistId", verifyJWT, getPlaylistById);     // Get single playlist details
router.put("/:playlistId", verifyJWT, updatePlaylist);      // Update playlist
router.delete("/:playlistId", verifyJWT, deletePlaylist);   // Delete playlist

// ➝ Manage videos inside playlist
router.post("/:playlistId/videos/:videoId", verifyJWT, addVideoToPlaylist);      // Add video
router.delete("/:playlistId/videos/:videoId", verifyJWT, removeVideoFromPlaylist); // Remove video

export default router;
