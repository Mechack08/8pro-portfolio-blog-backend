"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Portfolio extends Model {
    static associate(models) {
      // define association here
    }
  }
  Portfolio.init(
    {
      title: DataTypes.STRING,
      url: DataTypes.STRING,
      img: DataTypes.STRING,
      category: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Portfolio",
    }
  );
  return Portfolio;
};
