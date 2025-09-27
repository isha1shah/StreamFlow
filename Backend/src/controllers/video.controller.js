import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;

  // Multer stores files in req.files
  const videoFile = req.files?.videoFile?.[0]?.path;
  const thumbnail = req.files?.thumbnail?.[0]?.path;

  if (!title || !description || !duration || !videoFile || !thumbnail) {
    throw new ApiError(400, "All fields including files are required");
  }

  // Upload video and thumbnail to Cloudinary
  const uploadedVideo = await uploadOnCloudinary(videoFile, "videos");
  const uploadedThumbnail = await uploadOnCloudinary(thumbnail, "thumbnails");

  // Create video document
  const newVideo = await Video.create({
    title,
    description,
    duration,
    videoFile: uploadedVideo.secure_url,
    thumbnail: uploadedThumbnail.secure_url,
    owner: req.user._id
  });

  res.status(201).json({
    success: true,
    message: "Video uploaded successfully",
    data: newVideo
  });
});

// controllers/videoController.js
const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("owner", "username avatar"); // 👈 only send needed fields

    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getVideoById = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id)
    .populate("owner", "username avatar");
  if (!video) throw new ApiError(404, "Video not found");
  res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) throw new ApiError(404, "Video not found");

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this video");
  }

  const { title, description, duration } = req.body;
  video.title = title || video.title;
  video.description = description || video.description;
  video.duration = duration || video.duration;

  await video.save();
  res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
});
// In your video.controller.js - FIXED deleteVideo function
const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) throw new ApiError(404, "Video not found");

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this video");
  }

  // Use findByIdAndDelete instead of remove()
  await Video.findByIdAndDelete(req.params.id);
  
  res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"));
});
export {
  uploadVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo
};
