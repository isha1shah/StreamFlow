import React, { useState, useEffect } from "react";
import { getComments, createComment } from "../api/comment";
import CommentCard from "./CommentCard";

export default function CommentSection({ videoId, tweetId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [videoId, tweetId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await getComments(videoId, tweetId);
      setComments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      setSubmitting(true);
      const res = await createComment(newComment.trim(), videoId, tweetId);
      setComments(prev => [res.data, ...prev]);
      setNewComment("");
    } catch (err) {
      alert("Failed to post comment: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(c => c._id !== commentId));
  };

  const handleUpdateComment = (updatedComment) => {
    setComments(prev => prev.map(c => 
      c._id === updatedComment._id ? updatedComment : c
    ));
  };

  if (loading) {
    return <div className="text-center p-4">Loading comments...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Add Comment Form */}
      {currentUser && (
        <form onSubmit={handleSubmitComment} className="bg-white p-4 rounded-lg shadow-sm">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border rounded-lg mb-3 resize-none"
            rows="3"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-blue-400"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              currentUser={currentUser}
              onDelete={handleDeleteComment}
              onUpdate={handleUpdateComment}
            />
          ))
        )}
      </div>
    </div>
  );
}