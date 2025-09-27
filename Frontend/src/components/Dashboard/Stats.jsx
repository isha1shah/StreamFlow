
import React from "react";

export default function Stats({ stats }) {
  const statsData = stats || {};
  
  const statItems = [
    { label: "Total Videos", value: statsData.totalVideos || 0, color: "blue" },
    { label: "Subscribers", value: statsData.totalSubscribers || 0, color: "green" },
    { label: "Total Views", value: statsData.totalViews || 0, color: "purple" },
    { label: "Total Likes", value: statsData.totalLikes || 0, color: "red" }
  ];

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600", 
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((item, index) => (
        <div key={index} className={`p-6 rounded-lg shadow-sm border ${colorClasses[item.color]}`}>
          <h3 className="text-sm font-medium opacity-75">{item.label}</h3>
          <p className="text-3xl font-bold mt-2">{item.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
