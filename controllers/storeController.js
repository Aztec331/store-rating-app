const { Store, Rating, Sequelize } = require("../models");

// GET /api/stores?search=&sortBy=&order=
exports.listStoresForUsers = async (req, res) => {
  const { Op, fn, col, literal } = Sequelize;
  const { search = "", sortBy = "name", order = "asc" } = req.query;

  const stores = await Store.findAll({
    where: search ? {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
      ]
    } : undefined,
    include: [
      { model: Rating, attributes: [] },
      // user's own rating
      {
        model: Rating,
        required: false,
        where: { userId: req.user.id },
        attributes: ["value"],
        as: "UserRatings"
      }
    ],
    attributes: {
      include: [
        [fn("COALESCE", fn("AVG", col("Ratings.value")), 0), "avgRating"],
      ],
    },
    group: ["Store.id", "UserRatings.id"],
    order: [[literal(sortBy === "rating" ? `"avgRating"` : `"${sortBy}"`), order]],
  });

  // map "yourRating" cleanly
  const data = stores.map(s => {
    const json = s.toJSON();
    return { ...json, yourRating: json.UserRatings ? json.UserRatings.value : null };
  });

  res.json(data);
};

// POST /api/stores/:id/rating  { value }
exports.upsertRating = async (req, res) => {
  const { id: storeId } = req.params;
  const { value } = req.body;

  const [rating, created] = await Rating.findOrCreate({
    where: { userId: req.user.id, storeId },
    defaults: { value, userId: req.user.id, storeId },
  });
  if (!created) {
    rating.value = value;
    await rating.save();
  }

  // recompute average for response
  const { fn, col } = Sequelize;
  const avg = await Rating.findOne({
    where: { storeId },
    attributes: [[fn("AVG", col("value")), "avg"]],
    raw: true,
  });

  res.json({ rating, avgRating: Number(avg.avg || 0).toFixed(2) });
};
