import React, { useState, useEffect } from "react";
import { getLikes } from "../api/like";

export default function LikesModal({ videoId, commentId, tweetId, onClose }) {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const likesData = await getLikes(videoId, commentId, tweetId);
        setLikes(likesData.data || []);
      } catch (err) {
        console.error("Failed to fetch likes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [videoId, commentId, tweetId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-96 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Likes</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-light transition-colors"
            >
              ×
            </button>
          </div>
        </div>
        
        {/* Likes List */}
        <div className="overflow-y-auto max-h-80">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading likes...</p>
            </div>
          ) : likes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-2">🤍</div>
              <p>No likes yet</p>
              <p className="text-sm mt-1">Be the first to like this!</p>
            </div>
          ) : (
            likes.map((like) => (
              <div key={like._id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <img
                    src={like.likedBy?.avatar || "/default-avatar.jpg"}
                    alt={like.likedBy?.username}
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{like.likedBy?.username}</p>
                    <p className="text-xs text-gray-500">
                      Liked on {new Date(like.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            {likes.length} like{likes.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}