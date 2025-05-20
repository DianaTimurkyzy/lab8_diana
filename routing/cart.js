const express = require("express");

const cartController = require("../controllers/cartController");

const { STATUS_CODE } = require("../constants/statusCode");

const router = express.Router();

router.post("/add", cartController.addProductToCart);

module.exports = router;