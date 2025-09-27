
import React, { useState } from "react";
import {
  updateAccountDetails,
  updateUserAvatar,
  updateUserCover
} from "../api/user";

export default function Account({ user, onUserUpdate }) {
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 const handleAccountSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  try {
    const res = await updateAccountDetails(fullname, email);
    

    
    onUserUpdate(res.data);
    setFullname(res.data.fullname); // Update local state
    setEmail(res.data.email);
    
    alert("Account updated successfully");
  } catch (err) {
    setError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    if (!avatarFile) return alert("Select an avatar file");
    setLoading(true);
    try {
      const res = await updateUserAvatar(avatarFile);
      onUserUpdate(res.data);
      alert("Avatar updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCoverSubmit = async (e) => {
    e.preventDefault();
    if (!coverFile) return alert("Select a cover image");
    setLoading(true);
    try {
      const res = await updateUserCover(coverFile);
      onUserUpdate(res.data);
      alert("Cover updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Account Settings</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="bg-blue-50 text-blue-600 p-3 rounded-md mb-4">
          Updating...
        </div>
      )}

      {/* Account Form */}
      <form onSubmit={handleAccountSubmit} className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Personal Information</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Update Account
        </button>
      </form>

      {/* Avatar Form */}
      <form onSubmit={handleAvatarSubmit} className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Profile Avatar</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Upload Avatar
          </label>
          <input
            type="file"
            onChange={(e) => setAvatarFile(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            accept="image/*"
          />
        </div>
        
        <button 
          type="submit" 
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Update Avatar
        </button>
      </form>

      {/* Cover Form */}
      <form onSubmit={handleCoverSubmit} className="p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Cover Image</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Upload Cover Image
          </label>
          <input
            type="file"
            onChange={(e) => setCoverFile(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            accept="image/*"
          />
        </div>
        
        <button 
          type="submit" 
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
        >
          Update Cover
        </button>
      </form>
    </div>
  );
}