import React, { useState, useEffect } from "react";
import { subscribeChannel, unsubscribeChannel, getSubscriberCount, checkSubscriptionStatus } from "../api/subscription";

export default function SubscribeButton({ channelId, channelUsername, currentUser, size = "medium", showCount = true }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Size classes
  const sizeClasses = {
    small: "text-sm px-3 py-1",
    medium: "text-base px-4 py-2", 
    large: "text-lg px-6 py-3"
  };

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!channelId) return;
      
      try {
        setChecking(true);
        
        // Get subscriber count
        const countData = await getSubscriberCount(channelId);
        setSubscriberCount(countData.data?.count || 0);
        
        // Check if current user is subscribed
        if (currentUser) {
          const subscribed = await checkSubscriptionStatus(channelId);
          setIsSubscribed(subscribed);
        }
      } catch (err) {
        console.error("Failed to fetch subscription data:", err);
      } finally {
        setChecking(false);
      }
    };

    fetchSubscriptionData();
  }, [channelId, currentUser]);

  const handleSubscription = async () => {
    if (!currentUser) {
      alert("Please login to subscribe to channels");
      return;
    }

    if (currentUser._id === channelId) {
      alert("You cannot subscribe to your own channel");
      return;
    }

    try {
      setLoading(true);
      
      if (isSubscribed) {
        // Unsubscribe
        await unsubscribeChannel(channelId);
        setIsSubscribed(false);
        setSubscriberCount(prev => Math.max(0, prev - 1));
      } else {
        // Subscribe
        await subscribeChannel(channelId);
        setIsSubscribed(true);
        setSubscriberCount(prev => prev + 1);
      }
    } catch (err) {
      console.error("Subscription action failed:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className={`flex items-center gap-2 ${sizeClasses[size]} bg-gray-200 text-gray-600 rounded-lg animate-pulse`}>
        <div className="w-4 h-4 bg-gray-300 rounded"></div>
        {showCount && <div className="w-8 h-4 bg-gray-300 rounded"></div>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSubscription}
        disabled={loading || currentUser?._id === channelId}
        className={`
          font-medium rounded-lg transition-all duration-200 border-2
          ${isSubscribed 
            ? "bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300" 
            : "bg-red-600 text-white border-red-600 hover:bg-red-700"
          }
          ${sizeClasses[size]}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        title={currentUser?._id === channelId ? "Cannot subscribe to yourself" : isSubscribed ? "Unsubscribe" : "Subscribe"}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            {isSubscribed ? "Unsubscribing..." : "Subscribing..."}
          </span>
        ) : (
          isSubscribed ? "Subscribed" : "Subscribe"
        )}
      </button>

      {showCount && (
        <div className="text-sm text-gray-600 font-medium">
          {subscriberCount.toLocaleString()} {subscriberCount === 1 ? 'subscriber' : 'subscribers'}
        </div>
      )}
    </div>
  );
}