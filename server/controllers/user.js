import { StatusCodes } from "http-status-codes"
import bcrypt from "bcryptjs"

import {User,Review,ReviewImage, Request,Notification} from "../models/index.js"




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

export const addBio=async(req,res)=>{
        const {bio}=req.body;
        try{
        const user=await User.findByPk(req.userId);
        await user.update({bio});
        return res.status(StatusCodes.CREATED).json({msg:"bio_added"});
        }catch(err) {
            return res.status(StatusCodes.OK).json(err);
        }
}

export const makeAdminRequest=async(req,res)=>{
    try{
        const request=await Request.findOne({where:{userId:req.userId}});
     
        if(request) return res.status(StatusCodes.BAD_REQUEST).json({msg:"request_already_made"})
    await Request.create({
        userId:req.userId
    })
    return res.status(StatusCodes.CREATED).json({msg:"request_sent"});
    }catch(err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}


export const makeUserRequest=async(req,res)=>{
    const {email}=req.body;
        try{
        const user=await User.findOne({where:{email}});
        const request=await Request.findOne({where:{userId:user.id,position:"user"}});
        if(request) return res.status(StatusCodes.BAD_REQUEST).json({msg:"request_already_made"});
        await Request.create({
            userId:user.id,
            position:"user"
        })
        return res.status(StatusCodes.CREATED).json({msg:"request_sent"})
        }catch(err) {
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        }
}

export const deleteRequest=async(req,res)=>{
    try{
    const request=await Request.findOne({where:{userid:req.userId}});
    if(request) {
        await request.destroy();
    }
    
    return res.status(StatusCodes.OK).json({msg:"request_deleted"})
    }catch(err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}

export const getUserNotifications=async(req,res)=>{
    try{
    const notifications=await Notification.findAll({where:{userId:req.userId},order:[["updatedAt","DESC"]]});
    console.log(notifications)
    return res.status(StatusCodes.OK).json(notifications);
    }catch(err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}

export const openNotification=async(req,res)=>{
    try{
    await Notification.update({viewed:true},{where:{userId:req.userId}});
    return res.status(StatusCodes.OK).json({msg:"notification_viewed"});
    }catch(err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}