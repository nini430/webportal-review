import jwt from "jsonwebtoken"
import {StatusCodes} from "http-status-codes"

import {keys} from "../env.js"
import {User} from "../models/index.js"
 
export const checkAuth=(req,res,next)=>{
    console.log(req.user);
    if(req.user) {
        req.userId=req.user[0].id,
        req.role=req.user[0].role;
        return next()
        
    }  
   
    const token=req.cookies.accessToken;
    console.log(token);
    if(!token) return res.status(StatusCodes.UNAUTHORIZED).json({msg:"unaothorized"});

    jwt.verify(token,keys.JWT_SECRET,async(err,data)=>{
        if(err) return res.status(StatusCodes.BAD_REQUEST).json({msg:"token_bad_formatted"});

        const user=await User.findByPk(data.id);
        if(!user) return res.status(StatusCodes.BAD_REQUEST).json({msg:"invalid/expired_token"});

        req.userId=user.id;
        req.role=user.role;
        next();
    })  
}

