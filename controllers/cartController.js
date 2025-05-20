const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { STATUS_CODE } = require("../constants/statusCode");

const addProductToCart = async (req, res) => {
  const { name } = req.body;
  try {
    await Cart.add(name);
    const cartCount = await Cart.getProductsQuantity();
    res.status(STATUS_CODE.FOUND).json({ success: true, cartCount });
  } catch (error) {
    res.status(STATUS_CODE.NOT_FOUND).json({ error: error.message });
  }
};

const getProductsCount = async (req, res) => {
  const quantity = await Cart.getProductsQuantity();
  res.json({ quantity });
};

module.exports = { addProductToCart, getProductsCount };