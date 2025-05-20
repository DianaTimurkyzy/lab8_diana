const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { STATUS_CODE } = require("../constants/statusCode");

const addProductToCart = async (req, res) => {
  const { name } = req.body;
  try {
    const product = await Product.findByName(name);
    if (!product) {
      return res.status(STATUS_CODE.NOT_FOUND).json({ error: `Product "${name}" not found` });
    }
    await Cart.add(name);
    const cartCount = await Cart.getProductsQuantity();
    res.status(STATUS_CODE.OK).json({ success: true, cartCount });
  } catch (error) {
    res.status(STATUS_CODE. NOT_FOUND).json({ error: error.message });
  }
};

const getProductsCount = async (req, res) => {
  const quantity = await Cart.getProductsQuantity();
  res.json({ quantity });
};

module.exports = { addProductToCart, getProductsCount };