import {StatusCodes} from "http-status-codes"
import { Op } from "sequelize";
import {User} from "../models/index.js"

export const getAllUsers=async(req,res)=>{
    const {role,deleted}=req.query;
    let users;
    try{
    if(deleted) {
        users=await User.findAll({where:{status:"deleted"},attributes:{exclude:["password"]}})
    }else{
        users=await User.findAll({where:{role,id:{[Op.not]:req.userId},status:{[Op.not]:"deleted"}},attributes:{exclude:["password"]}});
    }
    
    return res.status(StatusCodes.OK).json(users);
    
    }catch(err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}

export const blockUnblockOrDelete=async(req,res)=>{
    console.log(req.body.userIds);
    try{
        await User.update({status:req.query.status},{where:{
            id:{
                [Op.in]:req.body.userIds
            }
        }})
        return res.status(StatusCodes.OK).json({msg:"users_statuses_updated"});
    }catch(err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}

export const makeAdminOrNonAdmin=async(req,res)=>{
    try{
    await User.update({role:req.query.role},{
        where:{
            id:{
                [Op.in]:req.body.userIds
            }
        }
    })
    return res.status(StatusCodes.OK).json({msg:"users_roles_updated"});
    }catch(err) {
        return res.status(StatusCodes.OK).json(err);
    }
}
