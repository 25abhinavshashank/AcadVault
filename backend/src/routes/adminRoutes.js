import express from "express";
import { deleteUser, getAllNotes, getAllUsers } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { userIdValidator } from "../validators/adminValidator.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/users", getAllUsers);
router.delete("/user/:id", userIdValidator, validateRequest, deleteUser);
router.get("/notes", getAllNotes);

export default router;
