import Comment from "../models/Comment.js";
import Note from "../models/Note.js";
import asyncHandler from "../middleware/asyncMiddleware.js";

const createComment = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.noteId);

  if (!note) {
    const error = new Error("Note not found.");
    error.statusCode = 404;
    throw error;
  }

  const comment = await Comment.create({
    text: req.body.text,
    userId: req.user._id,
    noteId: req.params.noteId
  });

  const populatedComment = await Comment.findById(comment._id).populate("userId", "name email");

  res.status(201).json({
    message: "Comment added successfully.",
    comment: populatedComment
  });
});

const getCommentsByNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.noteId).select("_id");

  if (!note) {
    const error = new Error("Note not found.");
    error.statusCode = 404;
    throw error;
  }

  const comments = await Comment.find({ noteId: req.params.noteId })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ comments });
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    const error = new Error("Comment not found.");
    error.statusCode = 404;
    throw error;
  }

  const isOwner = comment.userId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    const error = new Error("You are not allowed to delete this comment.");
    error.statusCode = 403;
    throw error;
  }

  await comment.deleteOne();

  res.status(200).json({
    message: "Comment deleted successfully."
  });
});

export { createComment, getCommentsByNote, deleteComment };
