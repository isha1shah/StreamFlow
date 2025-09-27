import React, { useState } from "react";
import { deleteVideo } from "../api/video";
import LikeButton from "./LikeButton";
import AddToPlaylistModal from "./AddToPlaylistModal";
import SubscribeButton from "./SubscribeButton";

export default function VideoCard({ video, currentUser, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    
    setLoading(true);
    try {
      await deleteVideo(video._id);
      onDelete?.(video._id);
    } catch (err) {
      alert("Failed to delete video: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={video.thumbnail || "/default-thumbnail.jpg"}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          {video.duration || "0:00"}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer">
          {video.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {video.description}
        </p>
        
        <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
          <span>{video.views || 0} views</span>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
  <img
    src={video.owner?.avatar || "/default-avatar.jpg"}
    alt={video.owner?.username}
    className="w-8 h-8 rounded-full"
  />
  <span className="text-sm font-medium text-gray-700 flex-1">
    {video.owner?.username}
  </span>
  <SubscribeButton
    channelId={video.owner?._id}
    channelUsername={video.owner?.username}
    currentUser={currentUser}
    size="small"
    showCount={false}
  />
</div>

        <div className="flex justify-between items-center">
          <LikeButton 
            videoId={video._id}
            initialLikesCount={video.likesCount || 0}
            currentUser={currentUser}
            size="small"
          />
          
          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = `/video/${video._id}`}
              className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Watch
            </button>
            <button
  onClick={() => setShowPlaylistModal(true)}
  className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
  title="Add to playlist"
>
  📁 Add
</button>
            
            {currentUser?._id === video.owner?._id && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 disabled:bg-red-400 transition-colors"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            )}
            <AddToPlaylistModal
  isOpen={showPlaylistModal}
  onClose={() => setShowPlaylistModal(false)}
  videoId={video._id}
  currentUser={currentUser}
/>
          </div>
        </div>
      </div>
    </div>
  );
}