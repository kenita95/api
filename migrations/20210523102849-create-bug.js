"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("bugs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      priority: {
        type: Sequelize.STRING,
      },
      assignee: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        as: "assignee",
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
        as: "assignedTo",
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("bugs");
  },
};
