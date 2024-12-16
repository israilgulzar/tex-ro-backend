const express = require("express");
const { body } = require("express-validator");
const {
  validateFormFields,
} = require("../../helpers/middlewares/validateForm");
const giftCardController = require("../../controllers/giftCard");
const adminAuth = require("../../helpers/middlewares/adminAuth");

const giftCardRouter = express.Router();

giftCardRouter.post(
  "/check-gift-card",
  validateFormFields([body("name").notEmpty().withMessage("name is required")]),
  adminAuth,
  async (req, res) => {
    const data = await giftCardController.checkGiftCardExisting(req.body);
    res.status(data.status_code).json(data);
  }
);

giftCardRouter.post(
  "/gift-card-details",
  validateFormFields([
    body("name").notEmpty().withMessage("gift card name is required"),
    body("image").notEmpty().withMessage("image is required"),
    body("description").notEmpty().withMessage("description is required"),
    body("title").notEmpty().withMessage("title is required"),
  ]),
  adminAuth,
  async (req, res) => {
    const data = await giftCardController.giftCardDetails(req.body);
    res.status(data.status_code).json(data);
  }
);

giftCardRouter.post(
  "/dropdown",
  validateFormFields([
    body("page").notEmpty().withMessage("page is required"),
    body("limit").notEmpty().withMessage("limit is required"),
  ]),
  async (req, res) => {
    const data = await giftCardController.surveyDropdown(req.body);
    res.status(data.status_code).json(data);
  }
);

giftCardRouter.post(
  "/get-gift-cards-list",
  validateFormFields([
    body("page").notEmpty().withMessage("page is required"),
    body("limit").notEmpty().withMessage("limit is required"),
  ]),
  adminAuth,
  async (req, res) => {
    const data = await giftCardController.getGiftCardList(req.body);
    res.status(data.status_code).json(data);
  }
);

giftCardRouter.post(
  "/change-status",
  validateFormFields([
    body("status").notEmpty().withMessage("status is required"),
    body("giftCardId").notEmpty().withMessage("gift card id is required"),
  ]),
  adminAuth,
  async (req, res) => {
    const data = await giftCardController.updateGiftCardStatus(req.body);
    res.status(data.status_code).json(data);
  }
);

giftCardRouter.get("/delete/:id", adminAuth, async (req, res) => {
  const data = await giftCardController.deleteGiftCard(req.params.id);
  res.status(data.status_code).json(data);
});

giftCardRouter.get(
  "/get-gift-card-products/:id",
  adminAuth,
  async (req, res) => {
    const data = await giftCardController.getSingleGiftCardProducts(
      req.params.id
    );
    res.status(data.status_code).json(data);
  }
);

giftCardRouter.get("/get-gift-card/:id", adminAuth, async (req, res) => {
  const data = await giftCardController.getSingleGiftCard(req.params.id);
  res.status(data.status_code).json(data);
});

module.exports = giftCardRouter;
