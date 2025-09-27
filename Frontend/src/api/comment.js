import axiosInstance from "./axiosInstance";

// Get comments for a video or tweet
export const getComments = async (videoId = null, tweetId = null) => {
  try {
    const params = {};
    if (videoId) params.video = videoId;
    if (tweetId) params.tweet = tweetId;
    
    const res = await axiosInstance.get("/comments", { params });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch comments");
  }
};

// Create a new comment
export const createComment = async (content, videoId = null, tweetId = null) => {
  try {
    const res = await axiosInstance.post("/comments", {
      content,
      video: videoId,
      tweet: tweetId,
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to create comment");
  }
};

// Update a comment
export const updateComment = async (commentId, content) => {
  try {
    const res = await axiosInstance.put(`/comments/${commentId}`, { content });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update comment");
  }
};

// Delete a comment
export const deleteComment = async (commentId) => {
  try {
    const res = await axiosInstance.delete(`/comments/${commentId}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to delete comment");
  }
};

// Like/unlike a comment
export const likeComment = async (commentId) => {
  try {
    const res = await axiosInstance.post(`/comments/${commentId}/like`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to like comment");
  }
};