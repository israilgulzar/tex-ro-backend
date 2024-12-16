const express = require("express");
const webScraperControl = require("../../controllers/webScraper");
const webScraper = require("../../controllers/webScraper/webScraper");
const webScraperRoutes = express.Router();

webScraperRoutes.get("/webScraper", async (req, res) => {
  const data = await webScraper.scrapeWeb();
  res.status(data.status_code).json(data);
});

// do not disturb
webScraperRoutes.get("/amazon", async (req, res) => {
  const data = await webScraperControl.scrapeAmazonReviews();
  res.status(data.status_code).json(data);
});

module.exports = webScraperRoutes;
