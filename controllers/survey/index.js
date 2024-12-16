const SurveyModel = require("../../models/surveyModel/survey");

const { makeRespObj } = require("../../AppUtils");

const surveyCheck = async ({ surveyId, ...restData }) => {
  try {
    const check = await SurveyModel.surveyCheck({
      surveyId,
      ...restData,
    });

    if (check) {
      return makeRespObj({
        status_code: 400,
        message: "Survey name already existing!",
        error: { name: "Survey name already existing!" },
      });
    }
    return makeRespObj({
      status_code: 200,
      message: "Duplicate survey not found",
    });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};
const surveyDetails = async ({ surveyId, ...restData }) => {
  try {
    const createOrUpdateSurveyDetail = await SurveyModel.createOrUpdateSurvey({
      surveyId,
      ...restData,
    });

    if (createOrUpdateSurveyDetail) {
      return makeRespObj({
        status_code: 200,
        message: surveyId
          ? "Survey updated successfully"
          : "Survey added successfully",
        data: createOrUpdateSurveyDetail,
      });
    }
    return makeRespObj({
      status_code: 400,
      message: "Failed to add survey details",
    });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};
const deleteSurvey = async (surveyId) => {
  try {
    const result = await SurveyModel.deleteSurvey(surveyId);

    if (result) {
      return makeRespObj({
        status_code: 200,
        message: "Survey deleted successfully.",
      });
    }
    return makeRespObj({
      status_code: 400,
      message: "Failed to delete survey.",
    });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};
const updateSurveyStatus = async ({ surveyId, status }) => {
  try {
    const result = await SurveyModel.surveyStatusChanged(surveyId, status);

    if (result) {
      return makeRespObj({
        status_code: 200,
        message: "Survey status changed successful.",
      });
    }
    return makeRespObj({
      status_code: 400,
      message: "Failed to change survey status.",
    });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};
const surveyDropdown = async (args) => {
  try {
    const result = await SurveyModel.fetchSurveyDropdown(args);

    if (result) {
      return makeRespObj({
        status_code: 200,
        message: "Products get successfully.",
        data: result,
      });
    }
    return makeRespObj({
      status_code: 400,
      message: "Failed to get products.",
    });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};
const getSurveyList = async (args) => {
  try {
    const result = await SurveyModel.fetchSurveyList(args);

    if (result) {
      return makeRespObj({
        status_code: 200,
        message: "surveys get successfully.",
        data: result,
      });
    }
    return makeRespObj({
      status_code: 400,
      message: "Failed to get surveys.",
    });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};
const getSingleSurveyProducts = async (args) => {
  try {
    const result = await SurveyModel.getSingleSurveyProducts(args);

    if (result) {
      return makeRespObj({
        status_code: 200,
        message: "Products get successfully.",
        data: result,
      });
    }
    return makeRespObj({
      status_code: 400,
      message: "Failed to get products.",
    });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};
const getSingleSurvey = async (surveyId) => {
  try {
    const result = await SurveyModel.getSingleSurvey(surveyId);

    if (result) {
      return makeRespObj({
        status_code: 200,
        message: "Survey get successfully.",
        data: result,
      });
    }
    return makeRespObj({
      status_code: 400,
      message: "Failed to get Survey.",
    });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

module.exports = {
  surveyDetails,
  updateSurveyStatus,
  deleteSurvey,
  surveyCheck,
  surveyDropdown,
  getSurveyList,
  getSingleSurveyProducts,
  getSingleSurvey,
};
