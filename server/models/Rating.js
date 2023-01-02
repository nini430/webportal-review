import { DataTypes } from "sequelize";
import sequelize from "../config/Database.js";
import Review from "./Review.js";
import User from "./User.js";


const Rating=sequelize.define("rating",{
    ratingId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    rating:{
        type:DataTypes.DECIMAL,
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

export default Rating;
