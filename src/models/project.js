"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      project.belongsTo(models.User, { as: "pm", foreignKey: "managerId" }),
        project.belongsTo(models.User, { as: "lead", foreignKey: "leadId" });
    }
  }
  project.init(
    {
      title: {
        type: DataTypes.STRING,
      },
      managerId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        as: "pm",
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      leadId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      description: {
        type: DataTypes.STRING,
      },
      startDate: {
        type: DataTypes.DATEONLY,
      },
      endDate: {
        type: DataTypes.DATEONLY,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      fileSrc: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "project",
    }
  );
  return project;
};
