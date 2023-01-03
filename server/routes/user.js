import express from "express"
import { addBio,  getUser, updateUser } from "../controllers/user.js";
import {checkAuth} from "../middleware/checkAuth.js"
import {adminOnly} from "../middleware/adminOnly.js"

const router=express.Router();


router.post("/add",checkAuth,addBio);
router.get("/:id",getUser);
router.put("/:id",checkAuth,updateUser);

export default router;

