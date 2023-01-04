import express from "express"

import { adminOnly } from "../middleware/adminOnly.js";
import { checkAuth } from "../middleware/checkAuth.js";
import {  blockUnblockOrDelete, getAllUsers, makeAdminOrNonAdmin } from "../controllers/admin.js";



const router=express.Router()


router.get("/allusers",checkAuth,adminOnly,getAllUsers);
router.put("/block",checkAuth,adminOnly,blockUnblockOrDelete);
router.put("/role",checkAuth,adminOnly,makeAdminOrNonAdmin);


export default router;