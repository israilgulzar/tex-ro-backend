const express = require("express");
const productControllers = require("../../controllers/product");
const adminAuth = require("../../helpers/middlewares/adminAuth");
const { body } = require("express-validator");
const {
  validateFormFields,
} = require("../../helpers/middlewares/validateForm");

const productRouter = express.Router();

productRouter.post(
  "/check-product",
  validateFormFields([body("name").notEmpty().withMessage("name is required")]),
  adminAuth,
  async (req, res) => {
    const data = await productControllers.productCheck(req.body);
    res.status(data.status_code).json(data);
  }
);
productRouter.post(
  "/product-details",
  validateFormFields([
    body("name").notEmpty().withMessage("name is required"),
    body("asin").notEmpty().withMessage("ASIN is required"),
    body("image").notEmpty().withMessage("image is required"),
  ]),
  adminAuth,
  async (req, res) => {
    const data = await productControllers.productDetails(req.body);
    res.status(data.status_code).json(data);
  }
);

productRouter.post(
  "/dropdown",
  validateFormFields([
    body("page").notEmpty().withMessage("page is required"),
    body("limit").notEmpty().withMessage("limit is required"),
  ]),
  async (req, res) => {
    const data = await productControllers.productDropdown(req.body);
    res.status(data.status_code).json(data);
  }
);

productRouter.post(
  "/get-product-list",
  validateFormFields([
    body("page").notEmpty().withMessage("page is required"),
    body("limit").notEmpty().withMessage("limit is required"),
  ]),
  adminAuth,
  async (req, res) => {
    const data = await productControllers.getProductList(req.body);
    res.status(data.status_code).json(data);
  }
);

productRouter.post(
  "/change-status",
  validateFormFields([
    body("status").notEmpty().withMessage("status is required"),
    body("productId").notEmpty().withMessage("Product id is required"),
  ]),
  adminAuth,
  async (req, res) => {
    const data = await productControllers.updateProductStatus(req.body);
    res.status(data.status_code).json(data);
  }
);

productRouter.get("/delete/:id", adminAuth, async (req, res) => {
  const data = await productControllers.deleteProduct(req.params.id);
  res.status(data.status_code).json(data);
});

productRouter.get("/get-product/:id", adminAuth, async (req, res) => {
  const data = await productControllers.getSingleProduct(req.params.id);
  res.status(data.status_code).json(data);
});

module.exports = productRouter;
