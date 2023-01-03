import {StatusCodes} from "http-status-codes"
import {User} from "../models/index.js"

export const getAllUsers=async(req,res)=>{
    const {role}=req.query;
    try{
    const users=await User.findAll({where:{role},attributes:{exclude:["password"]}});
    return res.status(StatusCodes.OK).json(users);
    
    }catch(err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}