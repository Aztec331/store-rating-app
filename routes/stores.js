const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { storeListQueryRules, ratingRules, handleValidation } = require("../middleware/validators");
const ctrl = require("../controllers/storeController");

// logged-in users can list/search stores
router.get("/", auth([]), storeListQueryRules, handleValidation, ctrl.listStoresForUsers);

// logged-in users can submit/modify rating
router.post("/:id/rating", auth([]), ratingRules, handleValidation, ctrl.upsertRating);

module.exports = router;
