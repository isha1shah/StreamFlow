import axiosInstance from "./axiosInstance";

// Like an item (video, comment, or tweet)
export const likeItem = async (videoId = null, commentId = null, tweetId = null) => {
  try {
    const res = await axiosInstance.post("/likes/like", {
      videoId,
      commentId, 
      tweetId
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to like item");
  }
};

// Unlike an item
export const unlikeItem = async (videoId = null, commentId = null, tweetId = null) => {
  try {
    const res = await axiosInstance.post("/likes/unlike", {
      videoId,
      commentId,
      tweetId
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to unlike item");
  }
};

// Get likes for an item
export const getLikes = async (videoId = null, commentId = null, tweetId = null) => {
  try {
    const params = {};
    if (videoId) params.videoId = videoId;
    if (commentId) params.commentId = commentId;
    if (tweetId) params.tweetId = tweetId;
    
    const res = await axiosInstance.get("/likes/likes", { params });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch likes");
  }
};

// Check if current user liked an item
export const checkUserLike = async (videoId = null, commentId = null, tweetId = null, currentUserId) => {
  try {
    const likesData = await getLikes(videoId, commentId, tweetId);
    const userLike = likesData.data?.find(like => like.likedBy?._id === currentUserId);
    return !!userLike;
  } catch (err) {
    return false;
  }
};