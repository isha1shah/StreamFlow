import React, { useState, useEffect } from "react";
import { getUserPlaylists, addVideoToPlaylist, removeVideoFromPlaylist } from "../api/playlist";

export default function AddToPlaylistModal({ isOpen, onClose, videoId, currentUser }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchPlaylists();
    }
  }, [isOpen, currentUser]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const playlistsData = await getUserPlaylists(currentUser._id);
      setPlaylists(playlistsData.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistToggle = async (playlist) => {
    const isVideoInPlaylist = playlist.videos?.some(video => video._id === videoId);
    
    try {
      setUpdating(true);
      
      if (isVideoInPlaylist) {
        await removeVideoFromPlaylist(playlist._id, videoId);
        // Update local state
        setPlaylists(prev => prev.map(p => 
          p._id === playlist._id 
            ? { ...p, videos: p.videos.filter(v => v._id !== videoId) }
            : p
        ));
      } else {
        await addVideoToPlaylist(playlist._id, videoId);
        // Update local state (you might want to fetch the video details)
        setPlaylists(prev => prev.map(p => 
          p._id === playlist._id 
            ? { ...p, videos: [...p.videos, { _id: videoId }] }
            : p
        ));
      }
    } catch (err) {
      alert("Operation failed: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl max-h-96 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add to Playlist</h2>
          <p className="text-sm text-gray-600 mt-1">Select playlists to add this video to</p>
        </div>

        <div className="overflow-y-auto max-h-64">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading playlists...</p>
            </div>
          ) : playlists.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No playlists found</p>
              <p className="text-sm mt-1">Create your first playlist to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {playlists.map((playlist) => {
                const isVideoInPlaylist = playlist.videos?.some(video => video._id === videoId);
                const isUpdating = updating;

                return (
                  <div key={playlist._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isVideoInPlaylist}
                        onChange={() => handlePlaylistToggle(playlist)}
                        disabled={isUpdating}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {playlist.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {playlist.videos?.length || 0} videos
                        </p>
                      </div>
                      {isUpdating && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}