import User from "./User.js"
import Review from "./Review.js"
import ReviewImage from "./ReviewImage.js"
import Rating from "./Rating.js";
import Like from "./Like.js";
import Comment from "./Comment.js";
import React from "./React.js";
import Request from "./Request.js";
import Notification from "./Notification.js";

User.hasMany(Review,{onUpdate:"CASCADE",onDelete:"CASCADE"});
Review.belongsTo(User,{onUpdate:"CASCADE",onDelete:"CASCADE"});




Review.hasMany(ReviewImage,{onUpdate:"CASCADE",onDelete:"CASCADE"});
ReviewImage.belongsTo(Review,{onUpdate:"CASCADE",onDelete:"CASCADE"});

User.hasMany(Comment,{onUpdate:"CASCADE",onDelete:"CASCADE"})
Comment.belongsTo(User,{onUpdate:"CASCADE",onDelete:"CASCADE"})


Review.hasMany(Comment,{onUpdate:"CASCADE",onDelete:"CASCADE"});
Comment.belongsTo(Review,{onUpdate:"CASCADE",onDelete:"CASCADE"});

User.hasOne(Request);
Request.belongsTo(User);

User.hasMany(Notification,{onUpdate:"CASCADE",onDelete:"CASCADE"});
Notification.belongsTo(User,{onUpdate:"CASCADE",onDelete:"CASCADE"});




export {User,Review,ReviewImage,Rating,Like,Comment,React,Request,Notification}