const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { STATUS_CODE } = require("../constants/statusCode");
const { MENU_LINKS } = require("../constants/navigation");

const getProductsView = async (req, res) => {
  const products = await Product.getAll();
  const cartCount = await Cart.getProductsQuantity();
  res.render("products", {
    headTitle: "Shop - Products",
    path: "/",
    menuLinks: MENU_LINKS,
    activeLinkPath: "/products",
    products,
    cartCount,
  });
};

const getAddProductView = async (req, res) => {
  const cartCount = await Cart.getProductsQuantity();
  res.render("add-product", {
    headTitle: "Shop - Add product",
    path: "/add",
    menuLinks: MENU_LINKS,
    activeLinkPath: "/products/add",
    cartCount,
  });
};

const addProduct = async (req, res) => {
  const { name, description, price } = req.body;
  const product = new Product(name, description, parseFloat(price));
  try {
    await Product.add(product);
    await Cart.add(name);
    res.status(STATUS_CODE.FOUND).redirect("/products/new");
  } catch (error) {
    const cartCount = await Cart.getProductsQuantity();
    res.status(STATUS_CODE.NOT_FOUND).render("404", {
      headTitle: "404 - Product Not Found",
      menuLinks: MENU_LINKS,
      activeLinkPath: "",
      cartCount,
    });
  }
};

const getNewProductView = async (req, res) => {
  const newestProduct = await Product.getLast();
  const cartCount = await Cart.getProductsQuantity();
  res.render("new-product", {
    headTitle: "Shop - New product",
    path: "/new",
    menuLinks: MENU_LINKS,
    activeLinkPath: "/products/new",
    newestProduct,
    cartCount,
  });
};

const getProductView = async (req, res) => {
  const { name } = req.params;
  const product = await Product.findByName(name);
  const cartCount = await Cart.getProductsQuantity();
  res.render("product", {
    headTitle: `Shop - ${product ? product.name : "Product Not Found"}`,
    path: `/${name}`,
    menuLinks: MENU_LINKS,
    activeLinkPath: `/products/${name}`,
    product,
    cartCount,
  });
};

const deleteProduct = async (req, res) => {
  const { name } = req.params;
  await Product.deleteByName(name);
  const cartItems = await Cart.getItems();
  await Cart.clearCart();
  for (const item of cartItems) {
    for (let i = 0; i < item.quantity; i++) {
      await Cart.add(item.productName);
    }
  }
  res.status(STATUS_CODE.OK).json({ success: true });
};

module.exports = {
  getProductsView,
  getAddProductView,
  addProduct,
  getNewProductView,
  getProductView,
  deleteProduct,
};