import express from "express"
import { addBio,  deleteRequest,  getUser, makeRequest, updateUser } from "../controllers/user.js";
import {checkAuth} from "../middleware/checkAuth.js"


const router=express.Router();


router.post("/add",checkAuth,addBio);
router.post("/request",checkAuth,makeRequest);
router.delete("/request",checkAuth,deleteRequest)
router.get("/:id",getUser);
router.put("/:id",checkAuth,updateUser);

export default router;

