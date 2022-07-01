"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      // define association here
    }
  }
  Article.init(
    {
      title: DataTypes.STRING,
      language: DataTypes.STRING,
      category: DataTypes.STRING,
      author: DataTypes.STRING,
      content: DataTypes.TEXT,
      img: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Article",
    }
  );
  return Article;
};
