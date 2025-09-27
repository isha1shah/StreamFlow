import axiosInstance from "./axiosInstance";

// Create a new playlist
export const createPlaylist = async (name, description) => {
  try {
    const res = await axiosInstance.post("/playlists", {
      name,
      description
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to create playlist");
  }
};

// Get all playlists for the current user
export const getUserPlaylists = async (userId) => {
  try {
    const res = await axiosInstance.get(`/playlists/user/${userId}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch playlists");
  }
};

// Get a single playlist by ID
export const getPlaylistById = async (playlistId) => {
  try {
    const res = await axiosInstance.get(`/playlists/${playlistId}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch playlist");
  }
};

// Update playlist details
export const updatePlaylist = async (playlistId, name, description) => {
  try {
    const res = await axiosInstance.put(`/playlists/${playlistId}`, {
      name,
      description
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update playlist");
  }
};

// Delete a playlist
export const deletePlaylist = async (playlistId) => {
  try {
    const res = await axiosInstance.delete(`/playlists/${playlistId}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to delete playlist");
  }
};

// Add video to playlist
export const addVideoToPlaylist = async (playlistId, videoId) => {
  try {
    const res = await axiosInstance.post(`/playlists/${playlistId}/videos/${videoId}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to add video to playlist");
  }
};

// Remove video from playlist
export const removeVideoFromPlaylist = async (playlistId, videoId) => {
  try {
    const res = await axiosInstance.delete(`/playlists/${playlistId}/videos/${videoId}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to remove video from playlist");
  }
};