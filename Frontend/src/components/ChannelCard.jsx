import React from "react";
import SubscribeButton from "./SubscribeButton";

export default function ChannelCard({ channel, currentUser, onSubscribe }) {
  const handleChannelClick = () => {
    // Navigate to channel page
    window.location.href = `/channel/${channel.username}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
      {/* Channel Header */}
      <div 
        className="h-24 bg-gradient-to-r from-blue-500 to-purple-600 cursor-pointer"
        onClick={handleChannelClick}
      ></div>
      
      <div className="p-4">
        {/* Channel Info */}
        <div className="flex items-start gap-3 mb-4">
          <img
            src={channel.avatar || "/default-avatar.jpg"}
            alt={channel.username}
            className="w-16 h-16 rounded-full border-4 border-white -mt-10 bg-white"
          />
          <div className="flex-1 min-w-0">
            <h3 
              className="font-bold text-lg truncate cursor-pointer hover:text-blue-600"
              onClick={handleChannelClick}
            >
              {channel.username}
            </h3>
            <p className="text-gray-600 text-sm truncate">
              {channel.subscribersCount?.toLocaleString() || 0} subscribers
            </p>
          </div>
        </div>

        {/* Subscribe Button */}
        <SubscribeButton
          channelId={channel._id}
          channelUsername={channel.username}
          currentUser={currentUser}
          size="medium"
          showCount={false}
        />
      </div>
    </div>
  );
}