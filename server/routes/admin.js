import express from "express"

import { adminOnly } from "../middleware/adminOnly.js";
import { checkAuth } from "../middleware/checkAuth.js";
import {  blockUnblockOrDelete, respondToRequest, getAdminRequests, getAllUsers, makeAdminOrNonAdmin } from "../controllers/admin.js";



const router=express.Router()


router.get("/allusers",checkAuth,adminOnly,getAllUsers);
router.put("/status",checkAuth,adminOnly,blockUnblockOrDelete);
router.put("/role",checkAuth,adminOnly,makeAdminOrNonAdmin);
router.put("/respond/:id",checkAuth,adminOnly,respondToRequest);
router.get("/requests",checkAuth,adminOnly,getAdminRequests);


export default router;

