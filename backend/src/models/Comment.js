import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
