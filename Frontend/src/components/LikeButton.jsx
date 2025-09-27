import React, { useState, useEffect } from "react";
import { likeItem, unlikeItem, getLikes } from "../api/like";

export default function LikeButton({ 
  videoId = null, 
  commentId = null, 
  tweetId = null, 
  initialLikesCount = 0,
  currentUser,
  size = "medium",
  showCount = true
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [loading, setLoading] = useState(false);

  // Size classes
  const sizeClasses = {
    small: "text-sm",
    medium: "text-base", 
    large: "text-lg"
  };

  // Fetch likes and check if current user liked the item
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const likesData = await getLikes(videoId, commentId, tweetId);
        setLikesCount(likesData.data?.length || 0);
        
        // Check if current user has liked this item
        if (currentUser && likesData.data) {
          const userLike = likesData.data.find(
            like => like.likedBy?._id === currentUser._id
          );
          setIsLiked(!!userLike);
        }
      } catch (err) {
        console.error("Failed to fetch likes:", err);
      }
    };

    fetchLikes();
  }, [videoId, commentId, tweetId, currentUser]);

  const handleLike = async () => {
    if (!currentUser) {
      alert("Please login to like this item");
      return;
    }

    try {
      setLoading(true);
      
      if (isLiked) {
        // Unlike the item
        await unlikeItem(videoId, commentId, tweetId);
        setLikesCount(prev => Math.max(0, prev - 1));
        setIsLiked(false);
      } else {
        // Like the item
        await likeItem(videoId, commentId, tweetId);
        setLikesCount(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (err) {
      console.error("Like action failed:", err);
      // Revert UI state on error
      setIsLiked(!isLiked);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading || !currentUser}
      className={`flex items-center gap-2 ${
        isLiked 
          ? "text-red-600 bg-red-50 border-red-200" 
          : "text-gray-600 bg-gray-50 border-gray-200 hover:text-red-600 hover:border-red-200"
      } border px-3 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all ${sizeClasses[size]}`}
      title={!currentUser ? "Login to like" : isLiked ? "Unlike" : "Like"}
    >
      <span className={`transition-transform ${loading ? "animate-pulse" : ""}`}>
        {isLiked ? "❤️" : "🤍"}
      </span>
      {showCount && <span className="font-medium">{likesCount}</span>}
    </button>
  );
}