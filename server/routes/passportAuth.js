import express from "express"
import passport from "passport";
import {StatusCodes} from "http-status-codes"

const CLIENT_URL="http://localhost:3000"
const router=express.Router();

router.get("/auth/login/fail",(req,res)=>{
    return res.status(StatusCodes.BAD_REQUEST).json({success:false,msg:"auth failed"});
})

router.get("/auth/login/success",(req,res)=>{
    if(req.user) {
        return res.status(StatusCodes.OK).json({
            success:true,
            user:req.user
        })
    }
})
router.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));

router.get("/auth/google/callback",passport.authenticate("google",{
    successRedirect:CLIENT_URL,
    failureRedirect:"/auth/login/fail"
}))

router.get("/auth/twitter",passport.authenticate("twitter",{scope:["profile","email"]}));

router.get("/auth/twitter/callback",passport.authenticate("twitter",{
    successRedirect:CLIENT_URL,
    failureRedirect:"/auth/login/fail"
}))

router.get("/auth/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err) console.log(err);
        req.session.destroy((err)=>{
            if(err) console.log(err);
            
            return res.status(StatusCodes.OK).json({msg:"logged_out"})
        })
    })
    

    
})


export default router;