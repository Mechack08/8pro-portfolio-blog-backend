"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Background extends Model {
    static associate(models) {
      // define association here
    }
  }
  Background.init(
    {
      institution: DataTypes.STRING,
      position: DataTypes.STRING,
      period: DataTypes.STRING,
      type: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Background",
    }
  );
  return Background;
};
