import React, { useState, useEffect } from "react";
import { getSubscribedChannels } from "../api/subscription";
import ChannelCard from "../components/ChannelCard";

export default function Subscriptions({ user }) {
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!user?._id) return;
      
      try {
        setLoading(true);
        const subscriptionsData = await getSubscribedChannels(user._id);
        
        // Transform data to match channel format
        const channels = subscriptionsData.data?.map(sub => ({
          ...sub.channel,
          subscribersCount: sub.subscribersCount // You might need to fetch this separately
        })) || [];
        
        setSubscribedChannels(channels);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading subscriptions...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Subscriptions</h1>
        <p className="text-gray-600">
          Channels you're subscribed to ({subscribedChannels.length})
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Subscribed Channels Grid */}
      {subscribedChannels.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">📺</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No subscriptions yet</h3>
          <p className="text-gray-600 mb-6">Subscribe to channels to see them here</p>
          <button
            onClick={() => window.location.href = "/videos"}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Explore Channels
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subscribedChannels.map((channel) => (
            <ChannelCard
              key={channel._id}
              channel={channel}
              currentUser={user}
            />
          ))}
        </div>
      )}
    </div>
  );
}