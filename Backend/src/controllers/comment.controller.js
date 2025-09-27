
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";

// ➝ Create a new comment (for a video or tweet)
export const createComment = asyncHandler(async (req, res) => {
  const { content, video, tweet } = req.body;

  if (!content) throw new ApiError(400, "Comment content is required");
  if (!video && !tweet) throw new ApiError(400, "Must provide video or tweet");

  const comment = await Comment.create({
    content,
    owner: req.user._id,
    video: video || null,
    tweet: tweet || null,
  });

  // Include likes count (default 0)
  const commentResponse = await Comment.findById(comment._id)
    .populate("owner", "username avatar")
    .lean();

  commentResponse.likesCount = commentResponse.likes ? commentResponse.likes.length : 0;

  res.status(201).json(new ApiResponse(201, commentResponse, "Comment created successfully"));
});

// ➝ Get comments for a specific video or tweet
export const getComments = asyncHandler(async (req, res) => {
  const { video, tweet } = req.query;

  if (!video && !tweet) throw new ApiError(400, "Must provide video or tweet");

  const filter = {};
  if (video) filter.video = video;
  if (tweet) filter.tweet = tweet;

  const comments = await Comment.find(filter)
    .populate("owner", "username avatar")
    .sort({ createdAt: -1 })
    .lean();

  // Add likes count for each comment
  const commentsWithLikes = comments.map(c => ({
    ...c,
    likesCount: c.likes ? c.likes.length : 0
  }));

  res.status(200).json(new ApiResponse(200, commentsWithLikes, "Comments fetched successfully"));
});

// ➝ Update a comment
export const updateComment = asyncHandler(async (req, res) => {
  const { comment: commentId } = req.params;
  const { content } = req.body;

  if (!content) throw new ApiError(400, "Content is required to update comment");

  const comment = await Comment.findById(commentId);

  if (!comment) throw new ApiError(404, "Comment not found");
  if (comment.owner.toString() !== req.user._id.toString())
    throw new ApiError(403, "You are not authorized to update this comment");

  comment.content = content;
  await comment.save();

  const updatedComment = await Comment.findById(commentId).populate("owner", "username avatar").lean();
  updatedComment.likesCount = updatedComment.likes ? updatedComment.likes.length : 0;

  res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

// ➝ Delete a comment
export const deleteComment = asyncHandler(async (req, res) => {
  const { comment: commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) throw new ApiError(404, "Comment not found");
  if (comment.owner.toString() !== req.user._id.toString())
    throw new ApiError(403, "You are not authorized to delete this comment");

  await comment.deleteOne();

  res.status(200).json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

// ➝ Like/unlike a comment
export const likeComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  const index = comment.likes.indexOf(userId);
  if (index === -1) {
    comment.likes.push(userId); // like
  } else {
    comment.likes.splice(index, 1); // unlike
  }

  await comment.save();

  res.status(200).json(new ApiResponse(200, { likesCount: comment.likes.length }, "Comment like updated"));
});
