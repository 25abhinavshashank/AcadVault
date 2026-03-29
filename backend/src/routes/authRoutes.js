import express from "express";
import {
  getCurrentUser,
  loginAdmin,
  loginUser,
  registerUser
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { loginValidator, registerValidator } from "../validators/authValidator.js";

const router = express.Router();

router.post("/register", registerValidator, validateRequest, registerUser);
router.post("/login", loginValidator, validateRequest, loginUser);
router.post("/admin/login", loginValidator, validateRequest, loginAdmin);
router.get("/me", protect, getCurrentUser);

export default router;
