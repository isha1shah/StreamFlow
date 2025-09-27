// src/api/user.js
import axiosInstance from "./axiosInstance";

export const updateAccountDetails = async (fullname, email) => {
  try {
    const { data } = await axiosInstance.patch("/users/me", {
      fullname,
      email
    });
    
    console.log("Update Account Response:", data); // Add this log
    
    return data;
  } catch (err) {
    console.error("Update Account Error:", err.response?.data || err.message);
    throw err;
  }
};

// -------------------- UPDATE AVATAR --------------------
export const updateUserAvatar = async (avatarFile) => {
  try {
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    const { data } = await axiosInstance.patch("/users/me/avatar", formData, multipartConfig);
    return data;
  } catch (err) {
    console.error("Update Avatar Error:", err.response?.data || err.message);
    throw err;
  }
};

// -------------------- UPDATE COVER IMAGE --------------------
export const updateUserCover = async (coverFile) => {
  try {
    const formData = new FormData();
    formData.append("coverImage", coverFile);
    const { data } = await axiosInstance.patch("/users/me/cover", formData, multipartConfig);
    return data;
  } catch (err) {
    console.error("Update Cover Error:", err.response?.data || err.message);
    throw err;
  }
};

// -------------------- CHANNEL PROFILE --------------------
export const getUserChannelProfile = async (username) => {
  try {
    const { data } = await axiosInstance.get(`/users/c/${username}`);
    return data;
  } catch (err) {
    console.error("Get Channel Profile Error:", err.response?.data || err.message);
    throw err;
  }
};

// -------------------- WATCH HISTORY --------------------
export const getWatchHistory = async () => {
  try {
    const { data } = await axiosInstance.get("/users/history");
    return data;
  } catch (err) {
    console.error("Get Watch History Error:", err.response?.data || err.message);
    throw err;
  }
};

// Make sure you have the correct import at the top


export const getChannelStats = async (channelId) => {
  try {
    console.log("Fetching stats for channel:", channelId);
    const res = await axiosInstance.get(`/dashboard/stats/${channelId}`);
    console.log("Channel stats response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Channel stats error details:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    throw new Error(err.response?.data?.message || "Failed to fetch channel stats");
  }
};

export const getChannelVideos = async (channelId) => {
  try {
    console.log("Fetching videos for channel:", channelId);
    const res = await axiosInstance.get(`/dashboard/videos/${channelId}`);
    console.log("Channel videos response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Channel videos error details:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    throw new Error(err.response?.data?.message || "Failed to fetch channel videos");
  }
};

export const getLikedVideos = async () => {
  try {
    console.log("Fetching liked videos");
    const res = await axiosInstance.get("/dashboard/liked-videos");
    console.log("Liked videos response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Liked videos error details:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    throw new Error(err.response?.data?.message || "Failed to fetch liked videos");
  }
};

// -------------------- UPLOAD NEW VIDEO --------------------
export const uploadNewVideo = async (formData) => {
  try {
    const { data } = await axiosInstance.post("/videos/upload", formData, multipartConfig);
    return data;
  } catch (err) {
    console.error("Upload Video Error:", err.response?.data || err.message);
    throw err;
  }
};
// Add to your api/user.js
export const deleteVideo = async (videoId) => {
  try {
    const { data } = await axiosInstance.delete(`/videos/${videoId}`);
    return data;
  } catch (err) {
    console.error("Delete Video Error:", err.response?.data || err.message);
    throw err;
  }
};

// In api/user.js - FIXED updateVideo function
export const updateVideo = async (videoId, updateData) => {
  try {
    const { data } = await axiosInstance.patch(`/videos/${videoId}`, updateData);
    return data;
  } catch (err) {
    console.error("Update Video Error:", err.response?.data || err.message);
    throw err;
  }
};
