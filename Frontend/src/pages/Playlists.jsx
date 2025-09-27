import React, { useState, useEffect } from "react";
import { getUserPlaylists } from "../api/playlist";
import PlaylistCard from "../components/PlaylistCard";
import CreatePlaylistModal from "../components/CreatePlaylistModal";

export default function Playlists({ user }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    if (user?._id) {
      fetchPlaylists();
    }
  }, [user]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const playlistsData = await getUserPlaylists(user._id);
      setPlaylists(playlistsData.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistCreated = (newPlaylist) => {
    setPlaylists(prev => [newPlaylist, ...prev]);
  };

  const handlePlaylistDeleted = (deletedPlaylistId) => {
    setPlaylists(prev => prev.filter(p => p._id !== deletedPlaylistId));
  };

  const handlePlaylistClick = (playlist) => {
    // Navigate to playlist detail page or show modal
    setSelectedPlaylist(playlist);
    // You can implement navigation here: window.location.href = `/playlist/${playlist._id}`
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading playlists...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Playlists</h1>
          <p className="text-gray-600 mt-2">Create and manage your video collections</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>+</span> Create Playlist
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Playlists Grid */}
      {playlists.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No playlists yet</h3>
          <p className="text-gray-600 mb-6">Create your first playlist to organize your favorite videos</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create Your First Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist._id}
              playlist={playlist}
              currentUser={user}
              onDelete={handlePlaylistDeleted}
              onClick={handlePlaylistClick}
            />
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPlaylistCreated={handlePlaylistCreated}
      />

      {/* Playlist Detail Modal (optional) */}
      {selectedPlaylist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-96 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{selectedPlaylist.name}</h2>
                <button 
                  onClick={() => setSelectedPlaylist(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mt-2">{selectedPlaylist.description}</p>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-64">
              <h3 className="font-semibold mb-4">Videos ({selectedPlaylist.videos?.length || 0})</h3>
              {selectedPlaylist.videos?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No videos in this playlist yet</p>
              ) : (
                <div className="space-y-3">
                  {selectedPlaylist.videos.map((video) => (
                    <div key={video._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <span className="font-medium text-sm flex-1">{video.title}</span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Watch
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}