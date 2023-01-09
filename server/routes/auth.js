import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js";
import { confirmVerification } from "../controllers/user.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/forget", forgotPassword);
router.post("/confirm", confirmVerification);
router.put("/reset/:resetToken", resetPassword);

export default router;
