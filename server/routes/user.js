import express from "express"
import { getUser, updateUser } from "../controllers/user.js";
import {checkAuth} from "../middleware/checkAuth.js"

const router=express.Router();


router.get("/:id",getUser);
router.put("/:id",checkAuth,updateUser);

export default router;

