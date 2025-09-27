
import React, { useState } from "react";
import { uploadNewVideo, deleteVideo, updateVideo } from "../../api/user";

export default function AddVideoModal({ onVideoAdded, videos = [] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingVideo, setEditingVideo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !duration || !videoFile || !thumbnail) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      let durationInSeconds;
      if (duration.includes(":")) {
        const parts = duration.split(":").map(Number);
        durationInSeconds = parts[0] * 60 + parts[1];
      } else {
        durationInSeconds = Number(duration);
      }

      formData.append("duration", durationInSeconds);
      formData.append("videoFile", videoFile);
      formData.append("thumbnail", thumbnail);

      const res = await uploadNewVideo(formData);
      onVideoAdded(res.data);
      resetForm();
      alert("Video uploaded successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setTitle(video.title);
    setDescription(video.description);
    setDuration(formatDuration(video.duration));
  };

  const handleUpdateVideo = async (e) => {
    e.preventDefault();
    if (!title || !description || !duration) {
      setError("Title, description and duration are required");
      return;
    }
    setLoading(true);
    try {
      let durationInSeconds;
      if (duration.includes(":")) {
        const parts = duration.split(":").map(Number);
        durationInSeconds = parts[0] * 60 + parts[1];
      } else {
        durationInSeconds = Number(duration);
      }

      // Send as JSON object instead of FormData
      const updateData = {
        title,
        description,
        duration: durationInSeconds
      };

      const res = await updateVideo(editingVideo._id, updateData);
      onVideoAdded(res.data);
      resetForm();
      alert("Video updated successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

// In your AddVideoModal.jsx - improve handleDeleteVideo
const handleDeleteVideo = async (videoId) => {
  if (!window.confirm("Are you sure you want to delete this video?")) return;
  
  try {
    await deleteVideo(videoId);
    // Remove the video from the local state immediately
    onVideoAdded('delete', videoId); // Pass action type and ID
    alert("Video deleted successfully!");
  } catch (err) {
    setError(err.response?.data?.message || "Delete failed");
  }
};

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDuration("");
    setVideoFile(null);
    setThumbnail(null);
    setEditingVideo(null);
    setError("");
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const cancelEdit = () => {
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Upload/Edit Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {editingVideo ? "Edit Video" : "Upload New Video"}
        </h3>
        <form onSubmit={editingVideo ? handleUpdateVideo : handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <textarea
            placeholder="Video description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 h-20"
          />
          <input
            type="text"
            placeholder="Duration (mm:ss)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          
          {!editingVideo && (
            <div>
              <input 
                type="file" 
                accept="video/*" 
                onChange={(e) => setVideoFile(e.target.files[0])}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700"
              />
              <span className="text-xs text-gray-500">Upload Video • Max 500MB</span>
            </div>
          )}

          <div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setThumbnail(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700"
            />
            <span className="text-xs text-gray-500">
              {editingVideo ? "Update Thumbnail (optional)" : "Upload Thumbnail"} • Recommended 1280x720
            </span>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="flex gap-2">
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Processing..." : editingVideo ? "Update Video" : "Upload Video"}
            </button>
            {editingVideo && (
              <button 
                type="button"
                onClick={cancelEdit}
                className="px-4 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Videos List */}
      {videos.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Videos</h3>
          <div className="space-y-3">
            {videos.map((video) => (
              <div key={video._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                <div className="flex items-center gap-3">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{video.title}</p>
                    <p className="text-sm text-gray-500">{formatDuration(video.duration)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditVideo(video)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteVideo(video._id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}