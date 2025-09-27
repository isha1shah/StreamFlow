
import React, { useState, useEffect } from "react";
import Stats from "../components/Dashboard/Stats";
import VideoTabs from "../components/Dashboard/VideoTabs";
import VideoGrid from "../components/Dashboard/VideoGrid";
import AddVideoModal from "../components/Dashboard/AddVideoModal";
import { getChannelStats, getChannelVideos, getLikedVideos } from "../api/user";

export default function Dashboard({ user }) {
  const [stats, setStats] = useState({});
  const [videos, setVideos] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("videos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const channelId = user._id;
        
        const statsRes = await getChannelStats(channelId);
        setStats(statsRes.data || {});
        
        const videosRes = await getChannelVideos(channelId);
        // Remove duplicates by ID
        const uniqueVideos = removeDuplicates(videosRes.data || [], '_id');
        setVideos(uniqueVideos);
        
        const likedRes = await getLikedVideos();
        // Remove duplicates from liked videos too
        const uniqueLikedVideos = removeDuplicates(likedRes.data || [], '_id');
        setLikedVideos(uniqueLikedVideos);
        
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Function to remove duplicates by key
  const removeDuplicates = (array, key) => {
    const seen = new Set();
    return array.filter(item => {
      const keyValue = item[key];
      if (seen.has(keyValue)) {
        return false;
      }
      seen.add(keyValue);
      return true;
    });
  };

  const videosToShow = activeTab === "videos" ? videos : likedVideos;

  // FIXED: Add proper error handling for undefined newVideo
  const handleVideoAdded = (newVideo) => {
    if (!newVideo || !newVideo._id) {
      console.error("Invalid video data received:", newVideo);
      return;
    }
    
    // Prevent adding duplicate videos
    setVideos(prev => {
      const exists = prev.some(video => video && video._id === newVideo._id);
      if (exists) {
        // If video exists, update it instead of adding duplicate
        return prev.map(video => video && video._id === newVideo._id ? newVideo : video);
      }
      return [newVideo, ...prev];
    });
  };

  if (loading) return <div className="text-center mt-10">Loading dashboard...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="p-6">
      <Stats stats={stats} />
      <AddVideoModal onVideoAdded={handleVideoAdded} videos={videos} />
      <VideoTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <VideoGrid videos={videosToShow} />
    </div>
  );
}