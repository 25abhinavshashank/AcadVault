import express from "express";
import { createComment, deleteComment, getCommentsByNote } from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  createCommentValidator,
  deleteCommentValidator,
  getCommentValidator
} from "../validators/commentValidator.js";

const router = express.Router();

router.post("/:noteId", protect, createCommentValidator, validateRequest, createComment);
router.get("/:noteId", getCommentValidator, validateRequest, getCommentsByNote);
router.delete("/:commentId", protect, deleteCommentValidator, validateRequest, deleteComment);

export default router;
