import { DataTypes,Model } from "sequelize";
import sequelize from "../config/Database.js"
import {nanoid} from "nanoid"
import crypto from "crypto"

class User extends Model {
    getResetPasswordToken() {
        const resetToken=crypto.randomBytes(20).toString("hex");

        this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");

        this.resetPasswordExpire=Date.now()+(10*(60*1000));

        return resetToken;

    }
}   

User.init({
    uuid:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4
    },
    firstName:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:"firstname_empty"
            }
        }
    },
    lastName:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:"lastname_empty"
            }
        }
    },
    gender:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            isIn:{
                args:[["male","female"]],
                msg:"no_selection"
            }
        }
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            isEmail:{
                msg:"incorrect_email_format"
            },
            notEmpty:{
                msg:"email_empty"
            }
        }
    },
    password:{
        type:DataTypes.STRING(2000),
        allowNull:false,
        validate:{
            notEmpty:{
                msg:"password_empty"
            }
        }
        
    },
    numberOfReviews:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    ratingNumber:{
        type:DataTypes.DECIMAL,
        defaultValue:0
    },
    role:{
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
        isIn:{
            args:[["admin","user"]],
            msg:"no_selection"
        }
    }
    },
    bio:{
        type:DataTypes.STRING(400),
    },
    adminPin:{
        type:DataTypes.STRING,
        set() {
            const role=this.getDataValue("role");
            if(role==="admin") {
                this.setDataValue("adminPin",nanoid());
            }
        }  
    },
    profileImg:{
        type:DataTypes.STRING,
        allowNull:false,
        set(value) {
            const profUpdated=this.getDataValue("profUpdated");
            
            if(!value&&!profUpdated) {
                const role=this.getDataValue("role");
                const gender=this.getDataValue("gender");
                console.log(gender,"genderi");
                console.log(role,"role")
                if(role==="user") {
                    this.setDataValue("profileImg",gender==="male"?"manAvatar.png":"womanAvatar.jpg");
                }else{
                    this.setDataValue("profileImg","admin.jpg");
                }
        
            }else{
                this.setDataValue("profileImg",value);
            }
        
        }
    },
    profUpdated:{
        type:DataTypes.BOOLEAN,
        defaultValue:false 
       },
    withSocials:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    resetPasswordToken:{
        type:DataTypes.STRING
    },
    resetPasswordExpire:{
        type:DataTypes.DATE
    },
    status:{
        type:DataTypes.STRING,
        defaultValue:"active"
    },
    twoFA:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    twoFACode:{
        type:DataTypes.STRING,
        
    },
    twoFACodeExpire:{
        type:DataTypes.DATE
    },
    phone:{
        type:DataTypes.STRING,
        
    }
},{sequelize,modelName:"user"})


export default User;