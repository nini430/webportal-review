import { StatusCodes } from "http-status-codes";
import { Op, Sequelize } from "sequelize";
import sequelize from "../config/Database.js";

import { Review, ReviewImage, User, Rating,Like, Comment,Notification } from "../models/index.js";


export const getAllReviews=async(req,res)=>{
  try{
    const reviews=await Review.findAll({include:[{model:User,attributes:["firstName","lastName","profileImg","profUpdated","uuid","id"]},{model:ReviewImage}]});
    return res.status(StatusCodes.OK).json(reviews);
  }catch(err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
}
export const getReviews = async (req, res) => {
  const { attribute } = req.query;
  try {
    const reviews = await Review.findAll({
      
      attributes: [
        "reviewName",
        "reviewedPiece",
        "averageRating",
        "uuid",
        "createdAt",
        "grade",
        "averageRating",
      ],
      include: [
        {
          model: User,
          attributes: [
            "firstName",
            "lastName",
            "uuid",
            "profileImg",
            "profUpdated",
          ],
        },
        { model: ReviewImage },
      ],
      order: [[attribute, "DESC"]],
      limit: 10,
    });
    return res.status(StatusCodes.OK).json(reviews);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

export const addReview = async (req, res) => {
  let userId;
  const { reviewName, reviewedPiece, group, tags, reviewText, images, grade,createdBy } =
    req.body;
  
  try {
    if(req.role==="admin" && ! createdBy) {
      return res.status(StatusCodes.BAD_REQUEST).json({createdBy:"add one user"})
    }
    if(createdBy) {
      userId=await User.findOne({where:{uuid:createdBy}})
    }
    const newReview = await Review.create({
      reviewName,
      reviewedPiece,
      group,
      tags,
      reviewText,
      grade,
      userId: userId.id||req.userId,
    });
    if (images.length) {
      await ReviewImage.bulkCreate(
        images.map((img) => ({ img, reviewId: newReview.id }))
      );
    } else {
      await ReviewImage.create({
        img: "review.jpg",
        reviewId: newReview.id,
        isDefault: true,
      });
    }

    const user = await newReview.getUser();
    user.numberOfReviews++;
    await user.save();
    return res.status(StatusCodes.CREATED).json({ msg: "review_created" });
  } catch (err) {
    let errors = {};
    if (err.name == "SequelizeValidationError") {
      err.errors.forEach((error) => {
        errors[error.path] = error.message;
      });
      return res.status(StatusCodes.BAD_REQUEST).json(errors);
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

export const getReview = async (req, res) => {
  let ratedUsers=[];
  let likedUsers=[];

  try {
    let review = await Review.findOne({
      where: { uuid: req.params.id },
      include: [
        {
          model: User,
          attributes: [
            "firstName",
            "lastName",
            "profileImg",
            "profUpdated",
            "uuid",
          ],
        },
        { model: ReviewImage },
      ],
    });
    if (!review)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "review_not_found" });
    
   
        ratedUsers=await Rating.findAll({where:{reviewId:review.id},attributes:["userId"]});
        ratedUsers=await User.findAll({
          where:{
            id:{
              [Op.in]:ratedUsers.map(user=>user.userId)
            
          },
          
        },
        attributes:["firstName","lastName","profileImg","profUpdated","uuid","id"],
        })

        ratedUsers=await Promise.all(ratedUsers.map(async user=>{
            const rating=await Rating.findOne({where:{reviewId:review.id,userId:user.id}});
            return {user,rating}
        }))

        likedUsers=await Like.findAll({where:{reviewId:review.id},attributes:["userId"]});
        likedUsers=await User.findAll({
          where:{
            id:{
              [Op.in]:likedUsers.map(user=>user.userId)
            },
            
          },
          attributes:["firstName","lastName","profileImg","profUpdated","uuid","id"]
        })

        likedUsers=likedUsers.map(user=>({user}))

    

    return res.status(StatusCodes.OK).json({ review,ratedUsers,likedUsers });
  } catch (err) {

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

export const rateReview = async (req, res) => {
    const {rating}=req.body;
    try {
      let notification;
    const review=await Review.findOne({where:{uuid:req.params.id}});
    const author=await User.findByPk(review.userId);
    const ratedBy=await User.findByPk(req.userId);
    if(!review) return res.status(StatusCodes.NOT_FOUND).json({msg:"review_not_found"});
    const rated=await Rating.findOne({where:{reviewId:review.id,userId:req.userId}});
    if(rated) {
      notification=await Notification.findOne({where:{reaction:"rate",userId:author.id,subjectId:review.uuid,madeBy:ratedBy.uuid}});
      notification.value=`${rating}`;
      notification.viewed=false;
      notification.updatedAt=Date.now()
      await notification.save(); 
        rated.rating=rating;
        await rated.save();
    }else{
        await Rating.create({
            reviewId:review.id,
            userId:req.userId,
            rating
        })
        if(author.id!==ratedBy.id) {
          notification=await Notification.create({
            reaction:"rate",
            userId:author.id,
            madeBy:ratedBy.uuid,
            subjectId:review.uuid,
            message:`${ratedBy.firstName} ${ratedBy.lastName} rated  to your review`,
            value:`${rating}`,
            updatedAt:Date.now()
          })
        }
       

        review.ratingsCount++;
        await review.save();
    }

    let ratingInfo=await Rating.findAll({
        where:{
            reviewId:review.id
        },
        attributes:[[sequelize.fn("SUM",sequelize.col("rating")),"rating_sum"],[sequelize.fn("COUNT",sequelize.col("rating")),"rating_count"]]
    })
    ratingInfo=ratingInfo[0].toJSON();
    review.averageRating=ratingInfo.rating_sum/ratingInfo.rating_count;
    await review.save();
    const user=await review.getUser();
    let averageSum=await Review.findAll({
      where:{
        userId:user.id
      },
      attributes:[[sequelize.fn("SUM",sequelize.col("averageRating")),"average_sum"]]
    })
  
    averageSum=averageSum[0]?.toJSON().average_sum||0;
    
    user.ratingNumber=(+averageSum/user.numberOfReviews);
    await user.save();
    
    return res.status(StatusCodes.OK).json({msg:"review_rated",notification,user:author.uuid,modified:rated});
    }catch(err) {
   
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}

export const likeReview=async(req,res)=>{
    try {
    let notification;
    const review=await Review.findOne({where:{uuid:req.params.id}});
    const user=await User.findByPk(review.userId);
    const likedBy=await User.findByPk(req.userId);
    if(!review) return res.status(StatusCodes.NOT_FOUND).json({msg:"review_not_found"});
    const liked=await Like.findOne({where:{reviewId:review.id,userId:req.userId}});
    if(liked) {
      if(likedBy.id!==user.id) {
      notification=await Notification.findOne({where:{userId:user.id,subjectId:review.uuid,madeBy:likedBy.uuid,reaction:"like"}});
        if(notification) {
          await notification.destroy();
        }
      }
      await liked.destroy();
      review.likesCount--;
    }else{
  
      await Like.create({
        reviewId:review.id,
        userId:req.userId
      })
      if(user.id!==likedBy.id) {
      const notifi=await Notification.findOne({where:{userId:user.id,subjectId:review.uuid,madeBy:likedBy.uuid,reaction:"like"}});
     
      if(!notifi) {
        notification=await Notification.create({
          userId:user.id,
          message:`${likedBy.firstName} ${likedBy.lastName} liked your review: ${review.reviewName}`,
          subjectId:review.uuid,
          madeBy:likedBy.uuid,
          reaction:"like",
          updatedAt:Date.now()
        })
      
      }
       
      }
     
      review.likesCount++;
    }
    await review.save();
    return res.status(StatusCodes.OK).json({msg:"review_like_update",user:user.uuid,notification,delete:liked});
    }catch(err) {
   
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}


export const editReview=async(req,res)=>{
  const { reviewName, reviewedPiece, group, tags, reviewText, addedImages,deletedImages, grade } =
    req.body;
  
    try{
      const review=await Review.findOne({where:{uuid:req.params.id}});
      if(!review) return res.status(StatusCodes.NOT_FOUND).json({msg:"review_not_found"});
      if(review.userId===req.userId||req.role==="admin") {
        await review.update({
          reviewName,
          reviewedPiece,
          group,
          tags,
          reviewText,
          grade
  
        })
      }else{
        return res.status(StatusCodes.FORBIDDEN).json({msg:"action_not_allowerd"})
      }
      
      

      if(addedImages.length) {
          const image=await ReviewImage.findOne({where:{reviewId:review.id,img:"review.jpg"}});
          if(image) await image.destroy();
          await ReviewImage.bulkCreate(addedImages.map(img=>({reviewId:review.id,img})));
      }

      if(deletedImages.length) {
          await ReviewImage.destroy({
            where:{
              id:{
                [Op.in]:deletedImages
              }
            }
          })
          const imgCount=await review.countReviewImages();
          if(!imgCount) await ReviewImage.create({reviewId:review.id,img:"review.jpg",isDefault:true});
      }

      return res.status(StatusCodes.OK).json({msg:"review_updated"});
    }catch(err) {
  
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}

export const deleteReview=async(req,res)=>{
  try{
    const review=await Review.findOne({where:{uuid:req.params.id}});
    if(!review) return res.status(StatusCodes.NOT_FOUND).json({msg:"review_not_found"});
    if(review.userId!==req.userId||req.role==="admin") {
      await review.destroy()
    }else{
      return res.status(StatusCodes.FORBIDDEN).json({msg:"action_not_allowed"})
    }
    
    return res.status(StatusCodes.OK).json({msg:"review_deleted"});
  }catch(err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
}

export const getTags=async(req,res)=>{
    try{
      const tags=await Review.findAll({
          attributes:["tags"]
      })
      return res.status(StatusCodes.OK).json(tags);
    }catch(err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}


export const searchThroughApp=async(req,res)=>{
  const {text}=req.query;

  let users=[];
  let reviews=[];
  let comments=[];
  try{
    users=await User.findAll({
      where:Sequelize.literal("MATCH(`firstName`,`lastName`,`email`,`bio`) AGAINST(:name IN BOOLEAN MODE)"),
      replacements:{
        name:`${text}*`
      },
      attributes:{exclude:["password"]}
    })

    reviews=await Review.findAll({
      where:Sequelize.literal("MATCH(`reviewName`,`reviewedPiece`,`group`,`tags`,`reviewText`) AGAINST(:name IN BOOLEAN MODE)"),
      replacements:{
        name:`+${text}`
      },
      include:[{model:User,attributes:["firstName","lastName","uuid","id","profileImg","profUpdated"]},{model:ReviewImage}]
    })

    comments=await Comment.findAll({
      where:Sequelize.literal("MATCH(`comment`) AGAINST(:name IN BOOLEAN MODE)"),
      replacements:{
        name:`+${text}`
      },
      include:[{model:User,attributes:["firstName","lastName","uuid","id","profileImg","profUpdated"]},{model:Review,include:[{model:User,attributes:["firstName","lastName","uuid","id","profileImg","profUpdated"]},{model:ReviewImage}]}]
    })
    return res.status(StatusCodes.OK).json({users,reviews,comments});
  }catch(err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
}
