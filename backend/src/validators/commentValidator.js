import { body, param } from "express-validator";

const createCommentValidator = [
  param("noteId").isMongoId().withMessage("Invalid note id."),
  body("text").trim().notEmpty().withMessage("Comment text is required.")
];

const getCommentValidator = [param("noteId").isMongoId().withMessage("Invalid note id.")];
const deleteCommentValidator = [param("commentId").isMongoId().withMessage("Invalid comment id.")];

export { createCommentValidator, getCommentValidator, deleteCommentValidator };
