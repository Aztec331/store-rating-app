"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Ratings", {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      value: { type: Sequelize.INTEGER, allowNull: false },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },
      storeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Stores", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
    // composite unique index: one rating per (user, store)
    await queryInterface.addConstraint("Ratings", {
      fields: ["userId", "storeId"],
      type: "unique",
      name: "unique_user_store_rating",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Ratings", "unique_user_store_rating");
    await queryInterface.dropTable("Ratings");
  },
};
