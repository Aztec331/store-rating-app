"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // A User can own many stores
      User.hasMany(models.Store, { foreignKey: "ownerId" });
      // A User can give many ratings
      User.hasMany(models.Rating, { foreignKey: "userId" });
    }
  }

  User.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM("admin", "user", "owner"), defaultValue: "user" },
      address: { type: DataTypes.STRING }
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
