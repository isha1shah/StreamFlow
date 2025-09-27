import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";

// ➝ Subscribe to a channel
export const subscribeChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (req.user._id.toString() === channelId) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }

  // check if already subscribed
  const existing = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });

  if (existing) {
    throw new ApiError(400, "Already subscribed to this channel");
  }

  const subscription = await Subscription.create({
    subscriber: req.user._id,
    channel: channelId,
  });

  res
    .status(201)
    .json(new ApiResponse(201, subscription, "Subscribed successfully"));
});

// ➝ Unsubscribe from a channel
export const unsubscribeChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const subscription = await Subscription.findOneAndDelete({
    subscriber: req.user._id,
    channel: channelId,
  });

  if (!subscription) {
    throw new ApiError(404, "Subscription not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Unsubscribed successfully"));
});

// ➝ Get subscriber count of a channel
export const getSubscriberCount = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const count = await Subscription.countDocuments({ channel: channelId });

  res
    .status(200)
    .json(new ApiResponse(200, { count }, "Subscriber count fetched"));
});

// ➝ Get channels subscribed by a user
export const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const subscriptions = await Subscription.find({ subscriber: userId }).populate(
    "channel",
    "username avatar"
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, subscriptions, "Subscribed channels fetched successfully")
    );
});

// ➝ Get subscribers of a channel
export const getChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const subscribers = await Subscription.find({ channel: channelId }).populate(
    "subscriber",
    "username avatar"
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, subscribers, "Channel subscribers fetched successfully")
    );
});
