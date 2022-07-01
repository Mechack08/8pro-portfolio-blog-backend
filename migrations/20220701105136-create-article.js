"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Articles", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      language: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: "Categories",
          key: "id",
        },
      },
      author: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: "Users",
          key: "id",
        },
      },
      content: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      img: {
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Articles");
  },
};
