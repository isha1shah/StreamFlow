
import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-white shadow-sm border-b border-gray-100 backdrop-blur-sm bg-white/95">
      {/* Logo */}
      <div
        className="text-3xl font-bold text-red-600 cursor-pointer transition-transform hover:scale-105 active:scale-95"
        onClick={() => navigate("/home")}
      >
        StreamFlow
      </div>

      {/* Search Bar - Centered and Enhanced */}
      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative">
          <input
            className="w-full px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Search videos, channels, and more..."
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-6">
        {/* Subscriptions Link */}
        <Link 
          to="/subscriptions" 
          className="flex items-center gap-1 text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium group"
        >
  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
  <path d="M18.7 8.7H5.3V7.3h13.4v1.4zm-2.7 4.7H8v1.3h8v-1.3zm-8-3.3h8v1.3H8v-1.3z"/>
</svg>
          <span className="hidden sm:block">Subscriptions</span>
        </Link>

        {/* User Area */}
        {user ? (
          <div className="flex items-center gap-4">

<span className="hidden md:block font-medium text-gray-800 bg-gray-100 px-3 py-1.5 rounded-full">
  {user.fullname || user.username || 'User'}
</span>
            <div className="relative group">
              <img
                src={
                  user.avatar
                    ? user.avatar.startsWith("http")
                      ? user.avatar
                      : `http://localhost:8000/${user.avatar}`
                    : "/default-avatar.png"
                }
                alt="User Avatar"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-transparent hover:border-red-500 transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={() => navigate("/account")}
              />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  My Account
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 font-medium"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 active:bg-red-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}