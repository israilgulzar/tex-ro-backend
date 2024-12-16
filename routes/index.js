const express = require("express");
const adminRoutes = require("./adminRoutes");
const productRoutes = require("./productRoutes");
const filesRoutes = require("./filesRoutes");
const surveyRoutes = require("./surveyRoutes");
const webScraperRoutes = require("./webScraper");
const giftCardRouter = require("./giftCardRoutes");

module.exports = (app) => {
  const router = express.Router();

  // Mount individual routers
  router.use("/scraper", webScraperRoutes);
  router.use("/admin", adminRoutes);
  router.use("/files", filesRoutes);
  router.use("/product", productRoutes);
  router.use("/survey", surveyRoutes);
  router.use("/gift-card", giftCardRouter);

  // Attach the main router to the app
  app.use(router);
};
