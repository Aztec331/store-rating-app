const { User, Store, Rating, Sequelize } = require("../models");

// POST /api/admin/users  (create any user)
exports.createUser = async (req, res) => {
  const bcrypt = require("bcrypt");
  const { name, email, password, role, address } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role, address });
  res.json(user);
};

// POST /api/admin/stores
exports.createStore = async (req, res) => {
  const { name, email, address, ownerId } = req.body;
  const store = await Store.create({ name, email, address, ownerId });
  res.json(store);
};

// GET /api/admin/dashboard
exports.dashboard = async (req, res) => {
  const [users, stores, ratings] = await Promise.all([
    User.count(), Store.count(), Rating.count()
  ]);
  res.json({ totalUsers: users, totalStores: stores, totalRatings: ratings });
};

// GET /api/admin/users?search=&role=&sortBy=&order=
exports.listUsers = async (req, res) => {
  const { search = "", role, sortBy = "name", order = "asc" } = req.query;
  const where = {};
  if (role) where.role = role;
  if (search) {
    const { Op } = require("sequelize");
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { address: { [Op.iLike]: `%${search}%` } },
    ];
  }
  const users = await User.findAll({ where, order: [[sortBy, order]] });
  res.json(users);
};

// GET /api/admin/stores?search=&sortBy=&order=
exports.listStores = async (req, res) => {
  const { Op, fn, col, literal } = Sequelize;
  const { search = "", sortBy = "name", order = "asc" } = req.query;

  // include avg rating via subquery
  const stores = await Store.findAll({
    where: search ? {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
      ]
    } : undefined,
    include: [{ model: Rating, attributes: [] }],
    attributes: {
      include: [[fn("COALESCE", fn("AVG", col("Ratings.value")), 0), "avgRating"]],
    },
    group: ["Store.id"],
    order: [[literal(sortBy === "rating" ? `"avgRating"` : `"${sortBy}"`), order]],
  });

  res.json(stores);
};

// GET /api/admin/users/:id  (if owner, include their store(s) & avg rating)
exports.getUserDetails = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.role !== "owner") return res.json(user);

  // owner: include their store(s) and avg rating
  const { Sequelize: S } = require("sequelize");
  const stores = await Store.findAll({
    where: { ownerId: user.id },
    include: [{ model: Rating, attributes: [] }],
    attributes: {
      include: [[S.fn("COALESCE", S.fn("AVG", S.col("Ratings.value")), 0), "avgRating"]],
    },
    group: ["Store.id"],
  });
  res.json({ ...user.toJSON(), stores });
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const bcrypt = require("bcrypt");
  const { User } = require("../models");

  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) return res.status(400).json({ error: "Old password incorrect" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: "Password updated" });
};
