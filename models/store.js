"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    static associate(models) {
      // Store belongs to a store owner (User)
      Store.belongsTo(models.User, { foreignKey: "ownerId", as: "owner" });

      // Store has many ratings
      Store.hasMany(models.Rating, { foreignKey: "storeId", as: "ratings" });
    }
  }

  Store.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      address: { type: DataTypes.STRING, allowNull: false },
      ownerId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Store",
      tableName: "Stores", // ensures consistent table name
    }
  );

  return Store;
};
