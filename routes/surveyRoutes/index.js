const express = require("express");
const surveyController = require("../../controllers/survey");
const adminAuth = require("../../helpers/middlewares/adminAuth");
const { body } = require("express-validator");
const {
  validateFormFields,
} = require("../../helpers/middlewares/validateForm");

const surveyRouter = express.Router();

surveyRouter.post(
  "/check-survey",
  validateFormFields([
    body("name").notEmpty().withMessage("survey name is required"),
  ]),
  adminAuth,
  async (req, res) => {
    const data = await surveyController.surveyCheck(req.body);
    res.status(data.status_code).json(data);
  }
);
surveyRouter.post(
  "/survey-details",
  validateFormFields([
    body("name").notEmpty().withMessage("survey name is required"),
    body("timeDelay").notEmpty().withMessage("time delay is required"),
    body("image").notEmpty().withMessage("image is required"),
    body("reviewLength").notEmpty().withMessage("review length is required"),
    body("starLength").notEmpty().withMessage("star length is required"),
    body("description").notEmpty().withMessage("description is required"),
    body("logo").notEmpty().withMessage("logo is required"),
    body("title").notEmpty().withMessage("title is required"),
  ]),
  adminAuth,
  async (req, res) => {
    const data = await surveyController.surveyDetails(req.body);
    res.status(data.status_code).json(data);
  }
);

surveyRouter.post(
  "/dropdown",
  validateFormFields([
    body("page").notEmpty().withMessage("page is required"),
    body("limit").notEmpty().withMessage("limit is required"),
  ]),
  async (req, res) => {
    const data = await surveyController.surveyDropdown(req.body);
    res.status(data.status_code).json(data);
  }
);

surveyRouter.post(
  "/get-survey-list",
  validateFormFields([
    body("page").notEmpty().withMessage("page is required"),
    body("limit").notEmpty().withMessage("limit is required"),
  ]),
  adminAuth,
  async (req, res) => {
    const data = await surveyController.getSurveyList(req.body);
    res.status(data.status_code).json(data);
  }
);

surveyRouter.post(
  "/change-status",
  validateFormFields([
    body("status").notEmpty().withMessage("status is required"),
    body("surveyId").notEmpty().withMessage("survey id is required"),
  ]),
  adminAuth,
  async (req, res) => {
    const data = await surveyController.updateSurveyStatus(req.body);
    res.status(data.status_code).json(data);
  }
);

surveyRouter.get("/delete/:id", adminAuth, async (req, res) => {
  const data = await surveyController.deleteSurvey(req.params.id);
  res.status(data.status_code).json(data);
});

surveyRouter.get("/get-survey-products/:id", adminAuth, async (req, res) => {
  const data = await surveyController.getSingleSurveyProducts(req.params.id);
  res.status(data.status_code).json(data);
});

surveyRouter.get("/get-survey/:id", async (req, res) => {
  const data = await surveyController.getSingleSurvey(req.params.id);
  res.status(data.status_code).json(data);
});

module.exports = surveyRouter;
