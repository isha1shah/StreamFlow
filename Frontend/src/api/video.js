
import axiosInstance from "./axiosInstance";

export const getAllVideos = async (page = 1, limit = 10) => {
  try {
    const res = await axiosInstance.get(`/videos?page=${page}&limit=${limit}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch videos");
  }
};

export const getVideoById = async (videoId) => {
  try {
    const res = await axiosInstance.get(`/videos/${videoId}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch video");
  }
};

export const uploadVideo = async (videoData) => {
  try {
    const res = await axiosInstance.post("/videos/upload", videoData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to upload video");
  }
};

export const updateVideo = async (videoId, videoData) => {
  try {
    const res = await axiosInstance.patch(`/videos/${videoId}`, videoData);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update video");
  }
};

export const deleteVideo = async (videoId) => {
  try {
    const res = await axiosInstance.delete(`/videos/${videoId}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to delete video");
  }
};