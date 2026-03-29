import { body, param, query } from "express-validator";

const uploadNoteValidator = [
  body("title").trim().notEmpty().withMessage("Title is required."),
  body("description").trim().notEmpty().withMessage("Description is required."),
  body("tags")
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) {
        return true;
      }

      if (typeof value === "string") {
        return true;
      }

      throw new Error("Tags must be an array or a comma-separated string.");
    })
];

const listNotesValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer."),
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limit must be 1-50."),
  query("search").optional().trim(),
  query("tags").optional().trim()
];

const noteIdValidator = [param("id").isMongoId().withMessage("Invalid note id.")];

export { uploadNoteValidator, listNotesValidator, noteIdValidator };
