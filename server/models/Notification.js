import { DataTypes } from "sequelize";
import sequelize from "../config/Database.js";

const Notification=sequelize.define("notification",{
    viewed:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    message:{
        type:DataTypes.STRING,
        allowNull:false
    },
    subjectId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    madeBy:{
        type:DataTypes.STRING,
        allowNull:false
    },
    reaction:{
        type:DataTypes.STRING,
        allowNull:false
    },
    value:{
        type:DataTypes.STRING
    },
    updatedAt:{
        type:DataTypes.DATE,
        allowNull:false
    }
},{timestamps:false})

export default Notification;

