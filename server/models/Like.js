import { DataTypes } from "sequelize";
import sequelize from "../config/Database.js";
import Review from "./Review.js";
import User from "./User.js";


const Like=sequelize.define("like",{
    likeId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
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
},{timestamps:false})

export default Like;