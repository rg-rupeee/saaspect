const express = require("express");
const router = express.Router();

const authController = require("./../controller/authController");
const costumerController = require("./../controller/costumerController");

router.route("/signup").post(authController.signup);

router.route("/signin").post(authController.signin);

router
  .route("/purchaseEdible")
  .post(authController.check, costumerController.purchaseEdible);

router
  .route("/checkPurchase/:edibleId")
  .post(authController.check, costumerController.checkPurchase);

module.exports = router;
