import React from "react";

export default function VideoGrid({ videos }) {
  if (!videos || videos.length === 0) return <p>No videos to display.</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {videos.map((video, index) => {
        console.log("Video owner:", video.owner); 

        return (
          <div key={video._id || index} className="border rounded-lg overflow-hidden">
            {/* Video player */}
            <video
              controls
              className="w-full h-40 object-cover"
              poster={video.thumbnail}
            >
              <source src={video.videoFile} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video details */}
            <div className="p-2">
              <h4 className="font-semibold">{video.title}</h4>
              <p className="text-gray-500 text-sm">
                by {video.owner?.username || "Unknown"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
