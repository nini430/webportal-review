import { StatusCodes } from "http-status-codes"
import bcrypt from "bcryptjs"

import {User,Review,ReviewImage} from "../models/index.js"
import { json } from "sequelize"


export const getUser=async(req,res)=>{
    try{
        const user=await User.findOne({where:{uuid:req.params.id},attributes:{exclude:["password"]},include:[{model:Review,include:[{model:ReviewImage}]}]})
    console.log(user);
    return res.status(StatusCodes.OK).json(user);
    }catch(err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}

export const updateUser=async(req,res)=>{
    const {profileImg,bio,firstName,lastName,oldPassword,newPassword}=req.body;
    const {personal}=req.query;
        try{
        const user=await User.findOne({where:{uuid:req.params.id}});
        if(!user) return res.status(StatusCodes.NOT_FOUND).json({msg:"user_not_found"});
        if(user.id!==req.userId) return res.status(StatusCodes.FORBIDDEN).json({msg:"action_not_allowed"});
        if(!personal) {
            await user.update({profileImg,bio})
        } else{
            if(oldPassword) {
                const isPasswordCorrect=await bcrypt.compare(oldPassword,user.password);
                if(!isPasswordCorrect) return res.status(StatusCodes.BAD_REQUEST).json({oldPassword:"wrong_password"})
                const salt=await bcrypt.genSalt(12);
                const newHashedPassword=await bcrypt.hash(newPassword,salt);
                user.password=newHashedPassword;
                await user.save();
            }

            if(firstName) await user.update({firstName});
            if(lastName) await user.update({lastName})

        }   
        const {password,...other}=user.toJSON();
        return res.status(StatusCodes.OK).json(other);
        }catch(err) {
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        }
}

