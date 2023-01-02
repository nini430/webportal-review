import { DataTypes, UUIDV4 } from "sequelize";
import sequelize from "../config/Database.js";
import {Review, User} from "../models/index.js"


const Comment=sequelize.define("comment",{
    commentId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    uuid:{
        type:DataTypes.UUID,
        defaultValue:UUIDV4
    },
    comment:{
        type:DataTypes.STRING(1000),
        allowNull:false,
        validate:{
            notEmpty:{
                msg:"comment_empty"
            }
        }
    },
    likesCount:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    heartCount:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    hahaCount:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    angryCount:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    sadCount:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    totalEmojiCount:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    reviewId:{
        type:DataTypes.INTEGER,
        references:{
            model:Review
        }
    },
    userId:{
        type:DataTypes.INTEGER,
        references:{
            model:User
        }
    }

})

export default Comment;