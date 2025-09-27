import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const likeItem = asyncHandler(async (req, res) => {
  const { videoId, commentId, tweetId } = req.body;

  if (!videoId && !commentId && !tweetId) {
    throw new ApiError(400, "Must provide videoId, commentId, or tweetId");
  }

  // Check if already liked
  const existingLike = await Like.findOne({
    video: videoId || null,
    Comment: commentId || null,
    tweet: tweetId || null,
    likedBy: req.user._id
  });

  if (existingLike) {
    throw new ApiError(400, "You have already liked this item");
  }

  const newLike = await Like.create({
    video: videoId || null,
    Comment: commentId || null,
    tweet: tweetId || null,
    likedBy: req.user._id
  });

  res.status(201).json(new ApiResponse(201, newLike, "Item liked successfully"));
});
const getLikes = asyncHandler(async (req, res) => {
  const { videoId, commentId, tweetId } = req.query;

  if (!videoId && !commentId && !tweetId) {
    throw new ApiError(400, "Must provide videoId, commentId, or tweetId");
  }

  const likes = await Like.find({
    video: videoId || null,
    Comment: commentId || null,
    tweet: tweetId || null
  }).populate("likedBy", "username avatar");

  res.status(200).json(new ApiResponse(200, likes, "Likes fetched successfully"));
});

const unlikeItem = asyncHandler(async (req, res) => {
  const { videoId, commentId, tweetId } = req.body;

  const like = await Like.findOneAndDelete({
    video: videoId || null,
    Comment: commentId || null,
    tweet: tweetId || null,
    likedBy: req.user._id
  });

  if (!like) {
    throw new ApiError(404, "Like not found");
  }

  res.status(200).json(new ApiResponse(200, {}, "Item unliked successfully"));
});


export { likeItem, unlikeItem, getLikes };


