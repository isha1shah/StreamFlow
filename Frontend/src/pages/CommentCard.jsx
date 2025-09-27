import React, { useState } from "react";
import { deleteComment, updateComment } from "../api/comment";
import LikeButton from "./LikeButton";

export default function CommentCard({ comment, currentUser, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  const isOwner = currentUser?._id === comment.owner?._id;

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
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-3">
        <img
          src={comment.owner?.avatar || "/default-avatar.jpg"}
          alt={comment.owner?.username}
          className="w-10 h-10 rounded-full border-2 border-gray-200"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-sm text-gray-900">
              {comment.owner?.username}
            </span>
            <span className="text-gray-500 text-xs">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows="3"
                placeholder="Edit your comment..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-800 text-sm mb-3 whitespace-pre-wrap">
                {comment.content}
              </p>
              
              <div className="flex items-center justify-between">
                <LikeButton 
                  commentId={comment._id}
                  initialLikesCount={comment.likesCount || 0}
                  currentUser={currentUser}
                  size="small"
                  showCount={true}
                />
                
                {isOwner && (
                  <div className="flex gap-3 text-xs">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800 disabled:text-gray-400 font-medium transition-colors"
                    >
                      {loading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}