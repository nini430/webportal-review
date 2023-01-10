import express from "express";
import {
  addBio,
  confirmVerification,
  getUser,
  getUserNotifications,
  getUserRequests,
  makeAdminRequest,
  openNotification,
  openRequests,
  sendVerificationCode,
  updateUser,
} from "../controllers/user.js";
import { checkAuth } from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/add", checkAuth, addBio);
router.post("/send", checkAuth, sendVerificationCode);
router.post("/confirm", checkAuth, confirmVerification);
router.post("/request", checkAuth, makeAdminRequest);
router.get("/notifications", checkAuth, getUserNotifications);
router.get("/requests", checkAuth, getUserRequests);
router.put("/openNots", checkAuth, openNotification);
router.put("/openReqs", checkAuth, openRequests);
router.get("/:id", getUser);
router.put("/:id", checkAuth, updateUser);

export default router;
