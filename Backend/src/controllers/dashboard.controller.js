import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ➝ Get channel statistics
const getChannelStats = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  // 1. Total videos by this channel
  const totalVideos = await Video.countDocuments({ owner: channelId });

  // 2. Total subscribers
  const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

  // 3. Total views across all videos
  const totalViewsAgg = await Video.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
    { $group: { _id: null, views: { $sum: "$views" } } },
  ]);
  const totalViews = totalViewsAgg[0]?.views || 0;

  // 4. Total likes on all videos of this channel
  const totalLikes = await Like.countDocuments({ videoOwner: channelId });

  res.status(200).json(
    new ApiResponse(200, {
      totalVideos,
      totalSubscribers,
      totalViews,
      totalLikes,
    }, "Channel stats fetched successfully")
  );
});

// ➝ Get all videos of a channel
const getLikedVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({ likes: req.user._id }).populate("owner", "username avatar");
  res.status(200).json({ data: videos });
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const videos = await Video.find({ owner: channelId })
    .populate("owner", "username avatar")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos,getLikedVideos };
