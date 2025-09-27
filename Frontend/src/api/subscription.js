import axiosInstance from "./axiosInstance";

// Subscribe to a channel
export const subscribeChannel = async (channelId) => {
  try {
    const res = await axiosInstance.post(`/subscriptions/${channelId}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to subscribe");
  }
};

// Unsubscribe from a channel
export const unsubscribeChannel = async (channelId) => {
  try {
    const res = await axiosInstance.delete(`/subscriptions/${channelId}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to unsubscribe");
  }
};

// Get subscriber count for a channel
export const getSubscriberCount = async (channelId) => {
  try {
    const res = await axiosInstance.get(`/subscriptions/${channelId}/count`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to get subscriber count");
  }
};

// Get channels subscribed by a user
export const getSubscribedChannels = async (userId) => {
  try {
    const res = await axiosInstance.get(`/subscriptions/user/${userId}/channels`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to get subscribed channels");
  }
};

// Get subscribers of a channel
export const getChannelSubscribers = async (channelId) => {
  try {
    const res = await axiosInstance.get(`/subscriptions/${channelId}/subscribers`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to get channel subscribers");
  }
};

// Check if current user is subscribed to a channel
export const checkSubscriptionStatus = async (channelId) => {
  try {
    const subscribedChannels = await getSubscribedChannels(channelId);
    return subscribedChannels.data?.some(sub => sub.channel?._id === channelId) || false;
  } catch (err) {
    return false;
  }
};