import React from "react";

export default function VideoTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex mb-4">
      <button
        className={`px-4 py-2 mt-4 rounded-t ${activeTab === "videos" ? "bg-red-600 text-white" : "bg-gray-200"}`}
        onClick={() => setActiveTab("videos")}
      >
        My Videos
      </button>
      <button
        className={`px-4 py-2 mt-4 rounded-t ml-2 ${activeTab === "liked" ? "bg-red-600 text-white" : "bg-gray-200"}`}
        onClick={() => setActiveTab("liked")}
      >
        Liked Videos
      </button>
    </div>
  );
}
