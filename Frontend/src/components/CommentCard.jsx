import React, { useState } from "react";
import { likeComment, deleteComment, updateComment } from "../api/comment";

export default function CommentCard({ comment, currentUser, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(false); // You'd need to check if current user liked this

  const isOwner = currentUser?._id === comment.owner?._id;

  const handleLike = async () => {
    try {
      setLoading(true);
      const res = await likeComment(comment._id);
      setLikesCount(res.data.likesCount);
      setHasLiked(!hasLiked);
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    
    try {
      setLoading(true);
      await deleteComment(comment._id);
      onDelete?.(comment._id);
    } catch (err) {
      alert("Failed to delete comment: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editContent.trim()) return;
    
    try {
      setLoading(true);
      const updatedComment = await updateComment(comment._id, editContent);
      onUpdate?.(updatedComment.data);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update comment: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-start gap-3">
        <img
          src={comment.owner?.avatar || "/default-avatar.jpg"}
          alt={comment.owner?.username}
          className="w-10 h-10 rounded-full"
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{comment.owner?.username}</span>
            <span className="text-gray-500 text-xs">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                rows="2"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:bg-blue-400"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 px-3 py-1 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-800 text-sm mb-2">{comment.content}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <button
                  onClick={handleLike}
                  disabled={loading}
                  className={`flex items-center gap-1 ${
                    hasLiked ? "text-red-600" : "hover:text-red-600"
                  }`}
                >
                  ❤️ {likesCount}
                </button>
                
                {isOwner && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="hover:text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="hover:text-red-600 disabled:text-gray-400"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}