import express from "express";
import {
  deleteNote,
  getNoteFile,
  getNoteById,
  getNotes,
  toggleLikeNote,
  uploadNote
} from "../controllers/noteController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  listNotesValidator,
  noteIdValidator,
  uploadNoteValidator
} from "../validators/noteValidator.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("file"),
  uploadNoteValidator,
  validateRequest,
  uploadNote
);
router.get("/", listNotesValidator, validateRequest, getNotes);
router.get("/:id/file", noteIdValidator, validateRequest, getNoteFile);
router.get("/:id", noteIdValidator, validateRequest, getNoteById);
router.delete("/:id", protect, noteIdValidator, validateRequest, deleteNote);
router.put("/like/:id", protect, noteIdValidator, validateRequest, toggleLikeNote);

export default router;
