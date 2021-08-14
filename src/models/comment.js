"use strict";
const moment = require('moment');

const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      comment.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  comment.init(
    {
      comment: {
        type: Sequelize.STRING,
      },
      bugId: {
        type: Sequelize.INTEGER,
        references: {
          model: "bugs",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      createdDate: {
        type: Sequelize.VIRTUAL,
        get() {
          return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD hh:mm:ss A')
        },
      },
    },
    {
      sequelize,
      modelName: "comment",
    }
  );
  return comment;
};
