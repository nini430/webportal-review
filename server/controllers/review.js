import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import sequelize from "../config/Database.js";

import { Review, ReviewImage, User, Rating,Like, Comment } from "../models/index.js";

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
  const { reviewName, reviewedPiece, group, tags, reviewText, images, grade } =
    req.body;
  try {
    const newReview = await Review.create({
      reviewName,
      reviewedPiece,
      group,
      tags,
      reviewText,
      grade,
      userId: req.userId,
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
    console.log(user);
    return res.status(StatusCodes.CREATED).json({ msg: "review_created" });
  } catch (err) {
    console.log(err);
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
  const { userId } = req.query;
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
    
    if(userId) {
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

    }

    return res.status(StatusCodes.OK).json({ review,ratedUsers,likedUsers });
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

export const rateReview = async (req, res) => {
    const {rating}=req.body;
    try {
    const review=await Review.findOne({where:{uuid:req.params.id}});
    if(!review) return res.status(StatusCodes.NOT_FOUND).json({msg:"review_not_found"});
    const rated=await Rating.findOne({where:{reviewId:review.id,userId:req.userId}});
    if(rated) {
        rated.rating=rating;
        await rated.save();
    }else{
        await Rating.create({
            reviewId:review.id,
            userId:req.userId,
            rating
        })

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
    console.log(user,"useriko")
    let averageSum=await Review.findAll({
      where:{
        userId:user.id
      },
      attributes:[[sequelize.fn("SUM",sequelize.col("averageRating")),"average_sum"]]
    })
  
    averageSum=averageSum[0]?.toJSON().average_sum||0;
    console.log(averageSum);
    console.log(+averageSum/user.numberOfReviews);
    user.ratingNumber=(+averageSum/user.numberOfReviews);
    await user.save();
    
    return res.status(StatusCodes.OK).json({msg:"review_rated"});
    }catch(err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
};

export const likeReview=async(req,res)=>{
    try {
    const review=await Review.findOne({where:{uuid:req.params.id}});
    if(!review) return res.status(StatusCodes.NOT_FOUND).json({msg:"review_not_found"});
    const liked=await Like.findOne({where:{reviewId:review.id,userId:req.userId}});
    if(liked) {
      await liked.destroy();
      review.likesCount--;
    }else{
      await Like.create({
        reviewId:review.id,
        userId:req.userId
      })
      review.likesCount++;
    }
    await review.save();
    return res.status(StatusCodes.OK).json({msg:"review_like_update"});
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
      
      await review.update({
        reviewName,
        reviewedPiece,
        group,
        tags,
        reviewText,
        grade

      })

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
      console.log(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}

export const deleteReview=async(req,res)=>{
  try{
    const review=await Review.findOne({where:{uuid:req.params.id}});
    if(!review) return res.status(StatusCodes.NOT_FOUND).json({msg:"review_not_found"});
    if(review.userId!==req.userId) return res.status(StatusCodes.FORBIDDEN).json({msg:"action_not_allowed"});
    await review.destroy()
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
  let users=[];
  let reviews=[];
  let comments=[];
  const {text}=req.query;
    try{
     users=await User.findAll({
      where:sequelize.literal("MATCH(`firstName`,`lastName`,`email`,`bio`) AGAINST(:name IN BOOLEAN MODE)"),
      replacements:{
        name:`${text}*`
      },
      attributes:{
        exclude:["password"]
      }
     }) 

     reviews=await Review.findAll({
      where:sequelize.literal("MATCH(`reviewName`,`reviewedPiece`,`group`,`tags`,`reviewText`) AGAINST(:name IN BOOLEAN MODE)"),
      replacements:{
        name:`+${text}`
      },
      include:[{model:User,attributes:["firstName","lastName","uuid","id","profileImg","profUpdated"]},{model:ReviewImage}]
     })

     comments=await Comment.findAll(
      {where:sequelize.literal("MATCH(`comment`) AGAINST(:name IN BOOLEAN MODE)"),
      replacements:{
        name:`+${text}`
      },
      include:[{model:User,attributes:["firstName","lastName","profileImg","profUpdated","uuid","id"]},{model:Review,include:[{model:User,attributes:["firstName","lastName","profileImg","profUpdated","uuid","id"]},{model:ReviewImage}]}]
    },
      
     )
      return res.status(StatusCodes.OK).json({users,reviews,comments})
    }catch(err) {
      console.log(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}
