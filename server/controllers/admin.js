import {StatusCodes} from "http-status-codes"
import { Op } from "sequelize";
import {Request, User} from "../models/index.js"
import {nanoid} from "nanoid"
import { sendEmail } from "../utils/sendEmail.js"

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
        await Request.destroy({where:{userId:{[Op.in]:req.body.userIds}}});
        
        return res.status(StatusCodes.OK).json({msg:"users_statuses_updated"});
    }catch(err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}

export const makeAdminOrNonAdmin=async(req,res)=>{
    const {role}=req.query;
    try{
    
    const users=await User.update({role,adminPin:role==="admin"?nanoid():""},{where:{
        id:{[Op.in]:req.body.userIds}
    }})

    console.log(users,"usersebilo");
    
    return res.status(StatusCodes.OK).json({msg:"users_roles_updated"});
    }catch(err) {
        return res.status(StatusCodes.OK).json(err);
    }
}

export const getAdminRequests=async(req,res)=>{
    try{
    const requests=await Request.findAll({where:{status:"pending"},include:[{model:User,attributes:{exclude:["password"]}}]});
    return res.status(StatusCodes.OK).json(requests);
    }catch(err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}

export const respondToRequest=async(req,res)=>{
    let savedUser;
    const {status}=req.body;
    const {position}=req.query;
    try{
        const user=await User.findOne({where:{uuid:req.params.id}})
        const request=await user.getRequest();
    request.status=status;
    await request.save();

    if(status==="fulfilled"&&position==="admin") {
        user.adminPin=nanoid();
        user.role="admin";
      savedUser=await user.save();
       console.log(savedUser.toJSON(),"saved saved");
    }

    if(status==="fulfilled" && position==="user") {
        user.status="active";
        await user.save();
            sendEmail({
                to:user.email,
                subject:`${user.firstName}, You account had beeen reactivated!`,
                text:"Your account reactivation is done! You can now go to your account anytime you want"
            })
    }

    if(status==="rejected" && position==="user") {
        sendEmail({
            to:"ninigogatishvili1@gmail.com",
            subject:`${user.firstName}, Your account reactivation request has been reject`,
            text:`If you have some further complains you can send us an E-mail with your explanation`
        })
    }



    return res.status(StatusCodes.OK).json({request,adminPin:savedUser?.adminPin});
    }catch(err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}



