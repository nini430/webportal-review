import express from "express"

const router=express.Router();
import {addReview,  deleteReview,  editReview,   getAllReviews,   getReview, getReviews, getTags, likeReview, rateReview, searchThroughApp} from "../controllers/review.js"
import {checkAuth} from "../middleware/checkAuth.js"
import {adminOnly} from "../middleware/adminOnly.js"

router.get("/all",checkAuth,adminOnly,getAllReviews);
router.get("/",getReviews);
router.get("/tags",checkAuth,getTags);
router.post("/",checkAuth,addReview);
router.get("/search",searchThroughApp);
router.get("/:id",getReview);
router.delete("/:id",checkAuth,deleteReview);
router.post("/rate/:id",checkAuth,rateReview);
router.put("/like/:id",checkAuth,likeReview);
router.put("/edit/:id",checkAuth,editReview);


export default router;

