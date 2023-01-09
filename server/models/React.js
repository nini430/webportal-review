import { DataTypes } from "sequelize";
import sequelize from "../config/Database.js";
import { Comment, Review, User } from "../models/index.js";

const React = sequelize.define("react", {
  emojiId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  emoji: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [["like", "heart", "haha", "sad", "angry"]],
        msg: "no_selection",
      },
    },
  },
  commentId: {
    type: DataTypes.INTEGER,
    references: {
      model: Comment,
      key: "commentId",
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
    },
  },
});

export default React;
