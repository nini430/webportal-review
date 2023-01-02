import express from "express"

const router=express.Router();
import {addReview,  deleteReview,  editReview,   getReview, getReviews, getTags, likeReview, rateReview, searchThroughApp} from "../controllers/review.js"
import {checkAuth} from "../middleware/checkAuth.js"
      
router.get("/",getReviews);
router.get("/tags",checkAuth,getTags);
router.post("/",checkAuth,addReview);
router.get("/search",searchThroughApp);
router.get("/:id",getReview);
router.delete("/:id",checkAuth,deleteReview);
router.post("/rate/:id",checkAuth,rateReview);
router.put("/like/:id",checkAuth,likeReview);
router.put("/edit/:id",editReview);


export default router;

