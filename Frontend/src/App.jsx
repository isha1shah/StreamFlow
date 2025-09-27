import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from './pages/Home'; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import { getCurrentUser } from "./api/auth";
import VideoPlayer from "./pages/VideoPlayer";
import TweetPage from "./pages/TweetPage";
import Playlists from "./pages/Playlists";
import ChannelPage from "./pages/ChannelPage";
import Subscriptions from "./pages/Subscriptions";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const PrivateRoute = ({ children }) => {
    if (loading) return <LoadingScreen />;
    return user ? children : <Navigate to="/register" replace />;
  };

  const PublicRoute = ({ children }) => {
    if (loading) return <LoadingScreen />;
    return children;
  };

  const DefaultRoute = () => {
    if (loading) return <LoadingScreen />;
    return user ? <Navigate to="/home" replace /> : <Navigate to="/register" replace />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {user && <Header user={user} onLogout={handleLogout} />}
      <div className="flex flex-1">
        {user && <Sidebar user={user} />}
        <main className="flex-1 bg-gray-100 p-6">
          <Routes>
            <Route path="/login" element={<PublicRoute><Login onAuth={setUser} /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register onAuth={setUser} /></PublicRoute>} />
            
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            // In App.jsx - check this route
<Route 
  path="/dashboard" 
  element={
    <PrivateRoute>
      <Dashboard user={user} />  {/* Make sure it's 'Dashboard' not 'DashboardPage' */}
    </PrivateRoute>
  } 
/>
            <Route path="/account" element={<PrivateRoute><Account user={user} onUserUpdate={setUser} /></PrivateRoute>} />
            
            <Route path="/" element={<DefaultRoute />} />
            <Route path="*" element={<DefaultRoute />} />
            <Route path="/video/:videoId" element={<VideoPlayer user={user} />} />
<Route path="/tweet/:tweetId" element={<TweetPage user={user} />} />
<Route 
  path="/playlists" 
  element={
    <PrivateRoute>
      <Playlists user={user} />
    </PrivateRoute>
  } 
/>
<Route path="/channel/:username" element={<ChannelPage user={user} />} />
<Route 
  path="/subscriptions" 
  element={
    <PrivateRoute>
      <Subscriptions user={user} />
    </PrivateRoute>
  } 
/>
          </Routes>
        </main>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen">
      <span className="text-gray-600 text-lg animate-pulse">Loading...</span>
    </div>
  );
}