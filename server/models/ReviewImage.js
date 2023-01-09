import { DataTypes } from "sequelize";
import sequelize from "../config/Database.js";

const ReviewImage = sequelize.define(
  "reviewImage",
  {
    img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { timestamps: false }
);

export default ReviewImage;
