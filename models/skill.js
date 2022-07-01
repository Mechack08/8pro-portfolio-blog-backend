"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    static associate(models) {
      // define association here
    }
  }
  Skill.init(
    {
      subject: DataTypes.STRING,
      level: DataTypes.BOOLEAN,
      category: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Skill",
    }
  );
  return Skill;
};
