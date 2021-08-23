"use strict";
const moment = require("moment");
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class bug extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      bug.belongsTo(models.User, { as: "assigneeId", foreignKey: "assignee" }),
        bug.belongsTo(models.User, {
          as: "assignedToId",
          foreignKey: "assignedTo",
        }),
        bug.belongsTo(models.project, { foreignKey: "projectId" });
    }
  }
  bug.init(
    {
      priority: {
        type: Sequelize.STRING,
      },
      assignee: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        as: "assigneeId",
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      severity: {
        type: Sequelize.STRING,
      },
      assignedTo: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        as: "assignedToId",
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      environment: {
        type: Sequelize.STRING,
      },
      labelId: {
        type: Sequelize.INTEGER,
        //
        references: {
          model: "project_labels",
          key: "id",
        },

        onDelete: "cascade",
        onUpdate: "cascade",
      },
      projectId: {
        type: Sequelize.INTEGER,
        //
        references: {
          model: "projects",
          key: "id",
        },

        onDelete: "cascade",
        onUpdate: "cascade",
      },
      resolution: {
        type: Sequelize.STRING,
      },
      existingVersion: {
        type: Sequelize.STRING,
      },
      comment: {
        type: Sequelize.STRING,
      },
      datePicked: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      fileUrl: {
        type: Sequelize.STRING,
      },
      createdDate: {
        type: Sequelize.VIRTUAL,
        get() {
          return moment(this.getDataValue("createdAt")).format(
            "YYYY-MM-DD hh:mm:ss A"
          );
        },
      },
      updatedDate: {
        type: Sequelize.VIRTUAL,
        get() {
          return moment(this.getDataValue("updatedAt")).format(
            "YYYY-MM-DD hh:mm:ss A"
          );
        },
      },
      title: { type: Sequelize.STRING },
    },
    {
      sequelize,
      modelName: "bug",
    }
  );
  return bug;
};
