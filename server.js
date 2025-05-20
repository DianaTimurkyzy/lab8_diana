const express = require("express");
const bodyParser = require("body-parser");
const { mongoConnect } = require("../lab8_diana/database");

const { PORT } = require("./config");
const logger = require("./utils/logger");
const productsRoutes = require("./routing/products");
const logoutRoutes = require("./routing/logout");
const killRoutes = require("./routing/kill");
const homeRoutes = require("./routing/home");
const cartRoutes = require("./routing/cart");
const { STATUS_CODE } = require("./constants/statusCode");
const { MENU_LINKS } = require("./constants/navigation");
const getFileFromAbsolutePath = require("./utils/getFileFromAbsolutePath");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(getFileFromAbsolutePath("public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((request, _response, next) => {
  const { url, method } = request;
  logger.getInfoLog(url, method);
  next();
});

app.use("/products", productsRoutes);
app.use("/cart", cartRoutes);
app.use("/logout", logoutRoutes);
app.use("/kill", killRoutes);
app.use(homeRoutes);

app.use((request, response) => {
  const { url } = request;
  const cartCount = 0;
  response.status(STATUS_CODE.NOT_FOUND).render("404", {
    headTitle: "404",
    menuLinks: MENU_LINKS,
    activeLinkPath: "",
    cartCount,
  });
  logger.getErrorLog(url);
});

mongoConnect(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});