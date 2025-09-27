import React, { useState, useEffect } from "react";
import { getChannelSubscribers } from "../api/subscription";

export default function SubscribersModal({ channelId, isOpen, onClose }) {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      if (isOpen && channelId) {
        try {
          setLoading(true);
          const subscribersData = await getChannelSubscribers(channelId);
          setSubscribers(subscribersData.data || []);
        } catch (err) {
          console.error("Failed to fetch subscribers:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSubscribers();
  }, [isOpen, channelId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-96 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Subscribers</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-light"
            >
              ×
            </button>
          </div>
        </div>
        
        {/* Subscribers List */}
        <div className="overflow-y-auto max-h-80">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading subscribers...</p>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-2">👥</div>
              <p>No subscribers yet</p>
            </div>
          ) : (
            subscribers.map((subscription) => (
              <div key={subscription._id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <img
                    src={subscription.subscriber?.avatar || "/default-avatar.jpg"}
                    alt={subscription.subscriber?.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {subscription.subscriber?.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      Subscribed on {new Date(subscription.createdAt).toLocaleDateString()}
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
            {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}