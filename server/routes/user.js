import express from "express"
import { addBio,  deleteRequest,  getUser, getUserNotifications, makeAdminRequest, makeUserRequest, openNotification, updateUser } from "../controllers/user.js";
import {checkAuth} from "../middleware/checkAuth.js"


const router=express.Router();


router.post("/add",checkAuth,addBio);
router.post("/userrequest",makeUserRequest);
router.post("/request",checkAuth,makeAdminRequest);
router.delete("/request",checkAuth,deleteRequest)
router.get("/notifications",checkAuth,getUserNotifications);
router.put("/openNots",checkAuth,openNotification)
router.get("/:id",getUser);
router.put("/:id",checkAuth,updateUser);

export default router;

