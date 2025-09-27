// src/pages/TweetPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserTweets } from "../api/tweet"; // You'll need to create this
import CommentSection from "../components/CommentSection";

export default function TweetPage({ user }) {
  const { tweetId } = useParams();
  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        // You'll need to create getTweetById API function
        const tweetData = await getUserTweets(tweetId);
        setTweet(tweetData.data);
      } catch (err) {
        console.error("Failed to fetch tweet:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTweet();
  }, [tweetId]);

  if (loading) return <div className="text-center p-8">Loading tweet...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Tweet Content */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={tweet.owner?.avatar}
            alt={tweet.owner?.username}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold">{tweet.owner?.username}</h3>
            <p className="text-gray-500 text-sm">
              {new Date(tweet.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <p className="text-gray-800 text-lg">{tweet.content}</p>
      </div>

      {/* Comments Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">
          Comments ({tweet.commentsCount || 0})
        </h2>
        <CommentSection 
          tweetId={tweetId} 
          currentUser={user} 
        />
      </div>
    </div>
  );
}