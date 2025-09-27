import React, { useState } from "react";
import { deletePlaylist } from "../api/playlist";

export default function PlaylistCard({ playlist, currentUser, onDelete, onClick }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent triggering onClick
    if (!window.confirm(`Are you sure you want to delete "${playlist.name}"?`)) return;
    
    setLoading(true);
    try {
      await deletePlaylist(playlist._id);
      onDelete?.(playlist._id);
    } catch (err) {
      alert("Failed to delete playlist: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = currentUser?._id === playlist.owner?._id;

  return (
    <div 
      onClick={() => onClick?.(playlist)}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
    >
      {/* Thumbnail - Show first video's thumbnail or default */}
      <div className="relative h-40 bg-gradient-to-br from-blue-100 to-purple-100">
        {playlist.videos?.length > 0 && playlist.videos[0]?.thumbnail ? (
          <img
            src={playlist.videos[0].thumbnail}
            alt={playlist.videos[0].title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl text-gray-400">🎵</div>
          </div>
        )}
        
        {/* Video count badge */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
          {playlist.videos?.length || 0} videos
        </div>
      </div>

      {/* Playlist info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1 flex-1 mr-2">
            {playlist.name}
          </h3>
          
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
              title="Delete playlist"
            >
              {loading ? "..." : "Delete"}
            </button>
          )}
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {playlist.description}
        </p>
        
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>By {playlist.owner?.username}</span>
          <span>{new Date(playlist.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}