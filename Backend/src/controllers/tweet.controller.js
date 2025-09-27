import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ➝ Create a new Tweet
export const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user._id, // from auth middleware
  });

  res.status(201).json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

// ➝ Get all Tweets
export const getAllTweets = asyncHandler(async (req, res) => {
  const tweets = await Tweet.find()
    .populate("owner", "username email") // show basic owner details
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, tweets, "All tweets fetched"));
});

// ➝ Get Tweets of a specific user
export const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, tweets, "User tweets fetched"));
});

// ➝ Update Tweet
export const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) throw new ApiError(404, "Tweet not found");

  // only owner can update
  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized action");
  }

  tweet.content = content || tweet.content;
  await tweet.save();

  res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

// ➝ Delete Tweet
export const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new ApiError(404, "Tweet not found");

  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized action");
  }

  await tweet.deleteOne();

  res.status(200).json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});
