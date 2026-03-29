import path from "node:path";
import cloudinary from "../config/cloudinary.js";
import Comment from "../models/Comment.js";
import Note from "../models/Note.js";
import asyncHandler from "../middleware/asyncMiddleware.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

const parseTags = (tags) => {
  if (!tags) {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.trim()).filter(Boolean);
  }

  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const getNoteFileMeta = (note) => {
  const fallbackFileName = note.fileUrl
    ? path.posix.basename(new URL(note.fileUrl).pathname)
    : path.posix.basename(note.publicId);
  const fileName = note.fileName || fallbackFileName;
  const publicIdExtension = path.posix.extname(note.publicId).replace(".", "").toLowerCase();
  const fileFormat =
    note.fileFormat ||
    path.posix.extname(fileName).replace(".", "").toLowerCase() ||
    publicIdExtension;

  return {
    fileName,
    fileFormat,
    publicId: note.publicId,
    publicIdExtension
  };
};

const uploadNote = asyncHandler(async (req, res) => {
  const { title, description, tags } = req.body;

  if (!req.file) {
    const error = new Error("A PDF or DOC file is required.");
    error.statusCode = 400;
    throw error;
  }

  const uploadedFile = await uploadToCloudinary(
    req.file.buffer,
    req.file.originalname,
    req.file.mimetype
  );

  const note = await Note.create({
    title,
    description,
    fileUrl: uploadedFile.secure_url,
    fileName: req.file.originalname,
    fileFormat: path.extname(req.file.originalname).replace(".", "").toLowerCase(),
    publicId: uploadedFile.public_id,
    uploadedBy: req.user._id,
    tags: parseTags(tags)
  });

  const populatedNote = await Note.findById(note._id).populate("uploadedBy", "name email role");

  res.status(201).json({
    message: "Note uploaded successfully.",
    note: populatedNote
  });
});

const getNotes = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search?.trim();
  const tags = req.query.tags?.trim();

  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } }
    ];
  }

  if (tags) {
    // Accept a comma-separated tag filter from the dashboard search form.
    const tagList = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (tagList.length) {
      query.tags = { $in: tagList };
    }
  }

  const [notes, total] = await Promise.all([
    Note.find(query)
      .populate("uploadedBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Note.countDocuments(query)
  ]);

  res.status(200).json({
    notes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id).populate("uploadedBy", "name email role");

  if (!note) {
    const error = new Error("Note not found.");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({ note });
});

const getNoteFile = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id).select(
    "publicId fileUrl fileName fileFormat title"
  );

  if (!note) {
    const error = new Error("Note not found.");
    error.statusCode = 404;
    throw error;
  }

  const { publicId, fileFormat, fileName, publicIdExtension } = getNoteFileMeta(note);

  if (!fileFormat && !publicIdExtension) {
    const error = new Error("Unable to determine the uploaded file format.");
    error.statusCode = 500;
    throw error;
  }

  const downloadFormat = publicIdExtension ? undefined : fileFormat;
  const downloadName =
    fileName || `${note.title}.${downloadFormat || publicIdExtension || "file"}`;

  const signedUrl = cloudinary.utils.private_download_url(publicId, downloadFormat, {
    resource_type: "raw",
    type: "upload",
    expires_at: Math.floor(Date.now() / 1000) + 60 * 10,
    attachment: downloadName
  });

  res.redirect(signedUrl);
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    const error = new Error("Note not found.");
    error.statusCode = 404;
    throw error;
  }

  const isOwner = note.uploadedBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    const error = new Error("You can only delete your own notes.");
    error.statusCode = 403;
    throw error;
  }

  await Promise.all([
    Note.findByIdAndDelete(req.params.id),
    Comment.deleteMany({ noteId: req.params.id }),
    cloudinary.uploader.destroy(note.publicId, { resource_type: "raw" })
  ]);

  res.status(200).json({ message: "Note deleted successfully." });
});

const toggleLikeNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    const error = new Error("Note not found.");
    error.statusCode = 404;
    throw error;
  }

  const userId = req.user._id.toString();
  const hasLiked = note.likes.some((like) => like.toString() === userId);

  if (hasLiked) {
    note.likes = note.likes.filter((like) => like.toString() !== userId);
  } else {
    note.likes.push(req.user._id);
  }

  await note.save();

  res.status(200).json({
    message: hasLiked ? "Note unliked successfully." : "Note liked successfully.",
    likesCount: note.likes.length,
    liked: !hasLiked
  });
});

export { uploadNote, getNotes, getNoteById, getNoteFile, deleteNote, toggleLikeNote };
