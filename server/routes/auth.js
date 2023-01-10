import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.js";
import { confirmVerification } from "../controllers/user.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/confirm", confirmVerification);


export default router;
