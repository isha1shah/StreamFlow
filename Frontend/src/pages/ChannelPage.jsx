import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserChannelProfile } from "../api/user";
import { getChannelVideos } from "../api/user";
import SubscribeButton from "../components/SubscribeButton";
import VideoGrid from "../components/Dashboard/VideoGrid";

export default function ChannelPage({ user }) {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        setLoading(true);
        
        // Fetch channel profile
        const channelData = await getUserChannelProfile(username);
        setChannel(channelData.data);
        
        // Fetch channel videos
        const videosData = await getChannelVideos(channelData.data._id);
        setVideos(videosData.data || []);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchChannelData();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading channel...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Channel not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Channel Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white mb-8 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-6">
            <img
              src={channel.avatar || "/default-avatar.jpg"}
              alt={channel.username}
              className="w-24 h-24 rounded-full border-4 border-white"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">@{channel.username}</h1>
              <div className="flex items-center gap-6 text-sm opacity-90">
                <span>{channel.subscribersCount?.toLocaleString() || 0} subscribers</span>
                <span>{channel.videosCount?.toLocaleString() || 0} videos</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <SubscribeButton
                channelId={channel._id}
                channelUsername={channel.username}
                currentUser={user}
                size="large"
                showCount={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Channel Videos */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Videos</h2>
        {videos.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos yet</h3>
            <p className="text-gray-600">This channel hasn't uploaded any videos</p>
          </div>
        ) : (
          <VideoGrid videos={videos} currentUser={user} />
        )}
      </div>
    </div>
  );
}