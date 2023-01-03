import express from "express"

import { adminOnly } from "../middleware/adminOnly.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { getAllUsers } from "../controllers/admin.js";



const router=express.Router()


router.get("/allusers",checkAuth,adminOnly,getAllUsers)

export default router;