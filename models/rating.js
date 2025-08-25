"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      Rating.belongsTo(models.User, { foreignKey: "userId" });
      Rating.belongsTo(models.Store, { foreignKey: "storeId" });
    }
  }

  Rating.init(
    {
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
      },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      storeId: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
      sequelize,
      modelName: "Rating",
    }
  );

  return Rating;
};
