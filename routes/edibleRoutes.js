const express = require("express");
const router = express.Router();

const edibleController = require("./../controller/edibleController");

router.route("/fetchEdibles").get(edibleController.fetchEdible);

router.route("/createEdibles").post(edibleController.createEdible);

router.route("/updateQuantity/:id").post(edibleController.updateEdibleQuantity);

module.exports = router;
