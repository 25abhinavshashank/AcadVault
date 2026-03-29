import cloudinary from "../config/cloudinary.js";
import Comment from "../models/Comment.js";
import Note from "../models/Note.js";
import User from "../models/User.js";
import asyncHandler from "../middleware/asyncMiddleware.js";

const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.status(200).json({ users });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  const userNotes = await Note.find({ uploadedBy: req.params.id }).select("_id publicId");
  const noteIds = userNotes.map((note) => note._id);

  await Promise.all(
    userNotes.map((note) =>
      cloudinary.uploader.destroy(note.publicId, { resource_type: "raw" })
    )
  );

  await Promise.all([
    User.findByIdAndDelete(req.params.id),
    Note.deleteMany({ uploadedBy: req.params.id }),
    Note.updateMany({}, { $pull: { likes: req.params.id } }),
    Comment.deleteMany({
      $or: [{ userId: req.params.id }, { noteId: { $in: noteIds } }]
    })
  ]);

  res.status(200).json({ message: "User deleted successfully." });
});

const getAllNotes = asyncHandler(async (_req, res) => {
  const notes = await Note.find()
    .populate("uploadedBy", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({ notes });
});

export { getAllUsers, deleteUser, getAllNotes };
