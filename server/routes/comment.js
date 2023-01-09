import express from "express";
import {
  addComment,
  deleteComment,
  editComment,
  getComments,
  reactComment,
  unreactComment,
} from "../controllers/comment.js";

import { checkAuth } from "../middleware/checkAuth.js";

const router = express.Router();

router.get("/:id", getComments);
router.post("/:id", checkAuth, addComment);
router.post("/react/:reviewId/:commentId", checkAuth, reactComment);
router.delete("/unreact/:reviewId/:commentId", checkAuth, unreactComment);
router.put("/:reviewId/:commentId", checkAuth, editComment);
router.delete("/:reviewId/:commentId", checkAuth, deleteComment);

export default router;
