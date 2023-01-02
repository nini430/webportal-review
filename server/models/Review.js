import { DataTypes } from "sequelize"
import sequelize from "../config/Database.js"


const Review=sequelize.define("review",{
    uuid:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4
        },
    reviewName:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:"review_name_empty"
            }
        }
    },
    reviewedPiece:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:"reviewed_piece_empty"
            }
        }

    },
    group:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            isIn:{
                args:[["games","art","music","theatre","dance","books","other"]],
                msg:"must_be_in_group"
            },
            notEmpty:{
                msg:"review_group_empty"
            }
        }
    },
    tags:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:"review_tags_empty"
            }
        }
    },
    reviewText:{
        type:DataTypes.STRING(300),
        allowNull:false,
        validate:{
            notEmpty:{
                msg:"review_text_empty"
            }
        }
    },
    grade:{
    type:DataTypes.INTEGER,
    allowNull:false,
    validate:{
        notEmpty:{
            msg:"review_grade_empty"
        },
        min:{
            args:[[0]],
            msg:"grade_minimum_0"
        },
        max:{
            args:[[10]],
            msg:"grade_maximum_10"
        }
    }
    },
    averageRating:{
        type:DataTypes.DECIMAL,
        defaultValue:0
    },
    likesCount:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    commentsCount:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    ratingsCount:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },


})

export default Review;