import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js"; // to validate video IDs

// ➝ Create a new playlist
export const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Name and description are required");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id, // comes from auth middleware
  });

  res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

// ➝ Get all playlists for the logged-in user
export const getUserPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ owner: req.user._id })
    .populate("videos", "title thumbnail") // show basic video info
    .populate("owner", "username avatar");

  res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});

// ➝ Get a single playlist by ID
export const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId)
    .populate("videos", "title thumbnail")
    .populate("owner", "username avatar");

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

// ➝ Update playlist details (name/description)
export const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this playlist");
  }

  if (name) playlist.name = name;
  if (description) playlist.description = description;

  await playlist.save();

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

// ➝ Delete a playlist
export const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this playlist");
  }

  await playlist.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

// ➝ Add a video to playlist
export const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { videoId } = req.body;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this playlist");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (!playlist.videos.includes(videoId)) {
    playlist.videos.push(videoId);
  }

  await playlist.save();

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video added to playlist"));
});

// ➝ Remove a video from playlist
export const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { videoId } = req.body;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this playlist");
  }

  playlist.videos = playlist.videos.filter(
    (vid) => vid.toString() !== videoId.toString()
  );

  await playlist.save();

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video removed from playlist"));
});
