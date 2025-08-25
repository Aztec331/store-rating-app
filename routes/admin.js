const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  userCreateRules, storeCreateRules, storeListQueryRules, handleValidation
} = require("../middleware/validators");
const ctrl = require("../controllers/adminController");

// All admin routes require admin role
router.post("/users", auth(["admin"]), userCreateRules, handleValidation, ctrl.createUser);
router.post("/stores", auth(["admin"]), storeCreateRules, handleValidation, ctrl.createStore);
router.get("/dashboard", auth(["admin"]), ctrl.dashboard);
router.get("/users", auth(["admin"]), ctrl.listUsers);
router.get("/users/:id", auth(["admin"]), ctrl.getUserDetails);
router.get("/stores", auth(["admin"]), storeListQueryRules, handleValidation, ctrl.listStores);

module.exports = router;
