import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      trim: true
    },
    fileFormat: {
      type: String,
      trim: true,
      lowercase: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    publicId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

noteSchema.index({ title: "text", description: "text", tags: "text" });

const Note = mongoose.model("Note", noteSchema);

export default Note;
