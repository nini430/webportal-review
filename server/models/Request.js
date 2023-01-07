import { DataTypes } from "sequelize"
import sequelize from "../config/Database.js"


const Request=sequelize.define("request",{
    
    position:{
        type:DataTypes.STRING,
        defaultValue:"admin"
    },
    status:{
        type:DataTypes.STRING,
        defaultValue:"pending"
    },
    viewed:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
})

export default Request;