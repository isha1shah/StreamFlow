
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/home", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { path: "/dashboard", label: "Dashboard", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { path: "/account", label: "Account", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

  const workingFeatures = [
    { path: "/subscriptions", label: "Subscriptions", icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" },
    { path: "/videos", label: "Browse Videos", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
  ];

  const isActive = (path) => location.pathname === path;
  const playlistsWorking = false;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 sticky top-0 h-screen flex flex-col">
      {/* Header */}
      <div className=" sticky p-6 border-b border-gray-100 flex-shrink-0 top-0 bg-white z-10">
        <h2 className="text-xl font-bold text-gray-800 sticky">Menu</h2>
        {user && <p className="text-sm text-gray-600 mt-1 truncate sticky">Welcome, {user.username}</p>}
      </div>

      {/* Navigation - This will not scroll, everything stays visible */}
      <nav className="p-4 flex-1">
        <ul className="space-y-1">
          {[...menuItems, ...workingFeatures].map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                  isActive(item.path)
                    ? "bg-red-50 text-red-600 border-l-4 border-red-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-l-4 hover:border-gray-200"
                }`}
              >
                <svg className={`w-5 h-5 ${isActive(item.path) ? "text-red-600" : "text-gray-400"}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="font-medium">{item.label}</span>
                {isActive(item.path) && <div className="ml-auto w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>}
              </button>
            </li>
          ))}
        </ul>

        {/* Quick Actions */}
        <div className="mt-8 border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button onClick={() => navigate("/dashboard")}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <span>Upload Video</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 text-xs text-gray-500 text-center bg-gray-50 flex-shrink-0">
        StreamFlow © {new Date().getFullYear()}
      </div>
    </aside>
  );
}