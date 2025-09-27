import axiosInstance from "./axiosInstance";

// Get all tweets
export const getAllTweets = async () => {
  return axiosInstance.get("/tweets");
};

// Get tweets of a specific user
export const getUserTweets = async (userId) => {
  return axiosInstance.get(`/tweets/user/${userId}`);
};

// Create a new tweet
export const createTweet = async (data) => {
  // data = { content: "text", ...optional }
  return axiosInstance.post("/tweets", data);
};

// Update a tweet
export const updateTweet = async (tweetId, data) => {
  return axiosInstance.put(`/tweets/${tweetId}`, data);
};

// Delete a tweet
export const deleteTweet = async (tweetId) => {
  return axiosInstance.delete(`/tweets/${tweetId}`);
};
