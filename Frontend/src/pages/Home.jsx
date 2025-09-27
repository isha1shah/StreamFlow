import React, { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import VideoCard from "../components/VideoCard";

export default function Home() {
  const [subscribedVideos, setSubscribedVideos] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("subscribed"); // default tab
  const token = localStorage.getItem("accessToken");

  // Fetch videos
 useEffect(() => {
  const fetchVideos = async () => {
    if (!token) {
      setError("You must be logged in to view videos.");
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem("user")); // you need this after login
      const channelId = user?._id;

      if (!channelId) {
        setError("Channel ID missing. Please log in again.");
        return;
      }

      // Channel videos
      const resSubscribed = await API.get(`/dashboard/${channelId}/videos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscribedVideos(resSubscribed.data?.data ?? []);

      // Liked videos
      const resLiked = await API.get("/dashboard/liked-videos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLikedVideos(resLiked.data?.data ?? []);
    } catch (err) {
      console.error("Failed to load videos:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load videos");
    }
  };
  fetchVideos();
}, [token]);


  const videosToShow = activeTab === "subscribed" ? subscribedVideos : likedVideos;

  return (
    <div className="flex-1 p-4">
      <h1 className="text-2xl font-bold mb-4">Home</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === "subscribed" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("subscribed")}
        >
          Subscribed Videos
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "liked" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("liked")}
        >
          Liked Videos
        </button>
      </div>

      {/* Videos Grid */}
      {videosToShow.length === 0 && !error ? (
        <p className="text-gray-500">No videos to show.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {videosToShow.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
