import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";

import { User, Comment, Review, React,Notification } from "../models/index.js";

export const getComments = async (req, res) => {
  let comments = [];
  try {
    const review = await Review.findOne({ where: { uuid: req.params.id } });
    if (!review)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "review_not_found" });
    if (+req.query.lastId == 0) {
      comments = await Comment.findAll({
        where: {
          reviewId: review.id,
        },
        limit: 10,
        include: [
          {
            model: User,
            attributes: [
              "firstName",
              "lastName",
              "profileImg",
              "profUpdated",
              "uuid",
              "id",
            ],
          },
        ],
        order: [["commentId", "DESC"]],
      });
    } else {
      comments = await Comment.findAll({
        where: {
          reviewId: review.id,
          commentId: {
            [Op.lt]: +req.query.lastId,
          },
        },
        limit: 10,
        include: [
          {
            model: User,
            attributes: [
              "firstName",
              "lastName",
              "profileImg",
              "profUpdated",
              "uuid",
              "id",
            ],
          },
        ],
        order: [["commentId", "DESC"]],
      });
    }

    comments=await Promise.all(comments.map(async comment=>{
        const reactedUsers=await React.findAll({where:{commentId:comment.commentId},attributes:["userId"]});
        let users=await User.findAll({where:{
          id:{
            [Op.in]:reactedUsers.map(user=>user.userId)
          },
        
        },attributes:["firstName","lastName","profileImg","profUpdated","id","uuid"]})

        users=await Promise.all(users.map(async user=>{
            const reaction=await React.findOne({where:{commentId:comment.commentId,userId:user.id}});
            return {user,reaction}
        }))

        return {comment,users}
    }))
    
    const lastId = comments[comments.length - 1]?.commentId || 0;
    return res.status(StatusCodes.OK).json({ comments, lastId });
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

export const addComment = async (req, res) => {
  const { comment } = req.body;
  try {
    const review = await Review.findOne({ where: { uuid: req.params.id } });
    if (!review)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "review_not_found" });
    const newComment = await Comment.create({
      reviewId: review.id,
      userId: req.userId,
      comment,
    });
    const user = await newComment.getUser();
    console.log(user);
    const commentRef = {
      ...newComment.toJSON(),
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        profileImg: user.profileImg,
        profUpdated: user.profUpdated,
        id: user.id,
        uuid: user.uuid,
      },
    };

    review.commentsCount++;
    console.log(newComment.toJSON());
    await review.save();
    return res.status(StatusCodes.CREATED).json({comment:commentRef,users:[]});
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

export const deleteComment = async (req, res) => {
  const { reviewId, commentId } = req.params;
  try {
    const review = await Review.findOne({ where: { uuid: reviewId } });
    if (!review)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "review_not_found" });
    const comment = await Comment.findOne({ where: { uuid: commentId } });
    if (!comment)
      return res.status(StatusCodes.OK).json({ msg: "comment_not_found" });

    if (comment.userId !== req.userId)
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: "action_not_allowed" });

    await comment.destroy();
    review.commentsCount--;
    await review.save();
    return res.status(StatusCodes.OK).json({ msg: "comment_deleted" });
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

export const editComment = async (req, res) => {
  const { reviewId, commentId } = req.params;
  const { updatedComment } = req.body;
  try {
    const review = await Review.findOne({ where: { uuid: reviewId } });
    if (!review)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "review_not_found" });
    const comment = await Comment.findOne({ where: { uuid: commentId } });
    if (!comment)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "comment_not_found" });
    if (comment.userId !== req.userId)
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: "action_not_allowed" });
    comment.comment = updatedComment;
    await comment.save();
    return res
      .status(StatusCodes.OK)
      .json({ success: true, text: comment.comment });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

export const reactComment = async (req, res) => {
  let updated=false;
  const { reviewId, commentId } = req.params;
  const { emoji } = req.body;
  let react;
  let oldEmoji;
  let notification;
  try {
    const review = await Review.findOne({ where: { uuid: reviewId } });
    if (!review)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "review_not_found" });
    const comment = await Comment.findOne({ where: { uuid: commentId } })
    
    if (!comment)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "comment_not_found" });
        const author=await User.findByPk(comment.userId);
    const reactedBy=await User.findByPk(req.userId);
    const reacted = await React.findOne({
      where: { commentId: comment.commentId, userId: req.userId },
    });
    if (reacted) {
      notification=await Notification.findOne({where:{userId:author.id,madeBy:reactedBy.uuid,subjectId:comment.uuid,reaction:"react"}});
      if(notification) {
        notification.value=emoji;
        notification.viewed=false;
        await notification.save();
      }
     
      updated=true;
      oldEmoji=reacted.emoji;
      comment[reacted.emoji + "Count"]--;
      reacted.emoji = emoji;
      react=await reacted.save();
    } else {
      react=await React.create({
        emoji,
        commentId: comment.commentId,
        userId: req.userId,
      });
      comment.totalEmojiCount++;

      if(author.id!==reactedBy.id) {
        notification=await Notification.create({
          userId:author.id,
          madeBy:reactedBy.uuid,
          subjectId:comment.uuid,
          reaction:"react",
          message:`${reactedBy.firstName} ${reactedBy.lastName} reacted to your comment`,
          value:emoji
      })
      }
      
    }

    comment[emoji + "Count"]++;
    await comment.save();
    const user=await User.findByPk(req.userId,{attributes:["firstName","lastName","profileImg","profUpdated","uuid","id"]})

    return res.status(StatusCodes.OK).json({user:{user,reaction:react},updated,oldEmoji,modified:reacted,notification,userId:author.uuid});
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

export const unreactComment=async(req,res)=>{
  const {reviewId,commentId}=req.params;
  let oldEmoji;
    try{
      const review=await Review.findOne({where:{uuid:reviewId}});
      if(!review) return res.status(StatusCodes.NOT_FOUND).json({msg:"review_not_found"});
      const comment=await Comment.findOne({where:{uuid:commentId}});
      if(!comment) return res.status(StatusCodes.NOT_FOUND).json({msg:"comment_not_found"});
      const reacted=await React.findOne({where:{commentId:comment.commentId,userId:req.userId}});

      if(!reacted) return res.status(StatusCodes.BAD_REQUEST).json({msg:"no_reaction"});
      oldEmoji=reacted.emoji;
      await reacted.destroy()
      comment.totalEmojiCount--;
      comment[reacted.emoji+"React"]--;
      await comment.save();
      return res.status(StatusCodes.OK).json({msg:"comment_unreacted",oldEmoji})
    }catch(err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}
