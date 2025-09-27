import React from "react";

export default function TweetCard({ tweet, onDelete }) {
  return (
    <div className="bg-white shadow rounded p-4 mb-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{tweet.user?.username}</h3>
        {onDelete && (
          <button
            onClick={() => onDelete(tweet._id)}
            className="text-red-600 text-sm hover:underline"
          >
            Delete
          </button>
        )}
      </div>
      <p className="text-gray-700 mt-2">{tweet.content}</p>
      <span className="text-xs text-gray-400">{new Date(tweet.createdAt).toLocaleString()}</span>
    </div>
  );
}
