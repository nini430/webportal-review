import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto"
import twilio from "twilio";

import {User,Review,ReviewImage,React,Request,Notification} from "../models/index.js";
import { loginValidator } from "../utils/validators.js";
import {keys} from "../env.js"
import { sendEmail } from "../utils/sendEmail.js";
import { Op } from "sequelize";

const client=twilio(keys.ACCOUNT_SID,keys.AUTH_TOKEN);
export const registerUser = async (req, res) => {
  let {
    firstName,
    lastName,
    gender,
    email,
    password,
    repeatPassword,
    profileImg,
    role,
  } = req.body;


  try {
    const user = await User.findOne({ where: { email } });

    if (user)
      return res
        .status(StatusCodes.CONFLICT)
        .json({ email: "user_already_exists" });
    if (password !== repeatPassword)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ repeatPassword: "password_no_match" });

  if(password) {
    const salt=await bcrypt.genSalt(12);
    password=await bcrypt.hash(password,salt);
  } 
 
   const newUser=await User.create({
      firstName,
      lastName,
      gender,
      email,
      password,
      role,
      profileImg,
      adminPin: null,
    });

    return res.status(StatusCodes.CREATED).json({ msg: "user_created",admin:newUser.adminPin });
  } catch (err) {
    console.log(err);
    let errors={};
    if(err.name==="SequelizeValidationError") {
        err.errors.forEach(error=>{
            errors[error.path]=error.message; 
        })
        return res.status(StatusCodes.BAD_REQUEST).json(errors);
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  } 
};

export const loginUser=async(req,res)=>{
  console.log(req.body,"Body")
  let requests;
  const {email,password,adminPin,admin}=req.body;
  const {isInvalid,errors}=loginValidator(admin?{email,password,adminPin}:{email,password});
  if(isInvalid) return res.status(StatusCodes.BAD_REQUEST).json(errors);
  let user;
  console.log(admin,"admim")
  try{
   if(admin) {
    console.log("admini sworia")
    user=await User.findOne({where:{email,adminPin}});
   }else{
    user=await User.findOne({where:{email}});
    if(user.adminPin) {
      return res.status(StatusCodes.FORBIDDEN).json({msg:"this_admin_account"});
    }
    if(user) {
      requests=await Request.findOne({where:{userId:user?.id,status:{[Op.not]:"pending"}}})
    }
    
    
   }

   if(!user) return res.status(StatusCodes.NOT_FOUND).json({email:"user_not_found"});

   const isCorrect=await bcrypt.compare(req.body.password,user.password);
   if(!isCorrect) return res.status(StatusCodes.BAD_REQUEST).json({password:"password_not_correct"});

   if(user.status==="blocked") {
    return res.status(StatusCodes.BAD_REQUEST).json({msg:"your_account_blocked"});
  }
  if(user.status==="deleted") {
    return res.status(StatusCodes.BAD_REQUEST).json({msg:"your_account_deleted",delete:true});
  }
  let code=crypto.randomBytes(3).toString("hex");
  user.twoFACode=code;
  user.twoFACodeExpire=Date.now()+(3*(60*1000));
  const savedUser=await user.save();
  if(user.twoFA) {
     client.messages.create({
      from:keys.TWILLIO_FROM,
      to:"+"+user.phone,
      body:`This is your code verification code ${savedUser.twoFACode}`
     })

     return res.status(StatusCodes.OK).json({twoFA:true,success:true})
  }

   const token=jwt.sign({id:user.id},keys.JWT_SECRET);

   const {password,...others}=user.toJSON();
   const notifications=await Notification.findAll({where:{userId:user.id},order:[["updatedAt","DESC"]]});
   if(req.role!=="admin") {
    requests=await Request.findAll({where:{status:{[Op.not]:"pending"},userId:user.id},order:[["createdAt","DESC"]]})
   }
   return res.cookie("accessToken",token,{httpOnly:true,path:"/"}).status(StatusCodes.OK).json({user:others,notifications,requests});
  }catch(err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
}


export const logoutUser=async(req,res)=>{
  return res.clearCookie("accessToken",{
    sameSite:"none"
  }).status(200).json({msg:"logged_out"})
}

export const forgotPassword=async(req,res)=>{
  const {email}=req.body;
  let user;
    try{
      user=await User.findOne({where:{email}});
      if(!user) return res.status(StatusCodes.NOT_FOUND).json({email:"user_not_found"});
      const resetToken=user.getResetPasswordToken();
      await user.save();
      const client_url=`http://localhost:3000/passwordReset/${resetToken}`
      const message=`
      <h1>You have requested Password Reset</h1>
      <p> Please follow the link below to reset your password </p>
      <a href=${client_url} clicktracking=off>${client_url}</a>
      `
    
        await sendEmail({
          to:user.email,
          subject:'Password Reset Request',
          text:message
        })
        return res.status(StatusCodes.OK).json({msg:"email_sent"})
      
     
    }catch(err) {
      console.log(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}

export const resetPassword=async(req,res)=>{
  const {resetToken}=req.params;
  const {newPassword}=req.body;
  const resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
  try{
    const user=await User.findOne({
      where:{
        resetPasswordToken,
        resetPasswordExpire:{
          [Op.gt]:Date.now()
        }
      }
    })
    if(!user) return res.status(StatusCodes.BAD_REQUEST).json({msg:"invalid/expired token"});
    const salt=await bcrypt.genSalt(12);
    const newPass=await bcrypt.hash(newPassword,salt);
    user.password=newPass;
    await user.save();
    return res.status(StatusCodes.OK).json({msg:"password_updated"});
  }catch(err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
}