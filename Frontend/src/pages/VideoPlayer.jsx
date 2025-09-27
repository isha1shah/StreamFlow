
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getVideoById } from "../api/video";
import CommentSection from "../components/CommentSection";
import LikeButton from "../components/LikeButton";
import LikesModal from "../components/LikesModal";

export default function VideoPlayer({ user }) {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLikesModal, setShowLikesModal] = useState(false);
  const videoRef = useRef(null);
  const [videoKey, setVideoKey] = useState(0);
  // Add key to force reload

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoData = await getVideoById(videoId);
        setVideo(videoData.data);
        
        // Force video reload when new data is fetched
        setVideoKey(prev => prev + 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  // Force video reload when component mounts or video changes
  useEffect(() => {
    if (videoRef.current && video) {
      videoRef.current.load(); // Reload the video element
      videoRef.current.currentTime = 0; // Reset to beginning
    }
  }, [videoKey, video?.duration]); // Reload when key or duration changes

  if (loading) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="text-lg text-gray-600">Loading video...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="text-lg text-red-600">Error: {error}</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Video Player Section */}
      <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
        <video
          key={videoKey} // Force re-render when key changes
          ref={videoRef}
          controls
          className="w-full h-auto max-h-[70vh]"
          poster={video.thumbnail}
          preload="metadata"
        >
          <source src={`${video.videoFile}?t=${Date.now()}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* Video Info Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-3 text-gray-900">{video.title}</h1>
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">{video.description}</p>
        
        <div className="flex justify-between items-center border-t pt-4">
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center gap-4">
              <span className="font-medium">{video.views || 0} views</span>
              <span>•</span>
              <span>Duration: {formatDuration(video.duration)}</span> {/* Show duration */}
              <span>•</span>
              <span>Uploaded on {new Date(video.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <LikeButton 
              videoId={videoId}
              initialLikesCount={video.likesCount || 0}
              currentUser={user}
              size="large"
              showCount={true}
            />
            
            <button
              onClick={() => setShowLikesModal(true)}
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              View Likes
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-3">
          Comments ({video.commentsCount || 0})
        </h2>
        <CommentSection 
          videoId={videoId} 
          currentUser={user} 
        />
      </div>

      {/* Likes Modal */}
      {showLikesModal && (
        <LikesModal
          videoId={videoId}
          onClose={() => setShowLikesModal(false)}
        />
      )}
    </div>
  );
}

// Add duration formatting function
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};