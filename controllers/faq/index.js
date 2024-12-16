const { makeRespObj } = require("../../AppUtils");
const FaqsModel = require("../../models/faqsModel/faqs");

const createFaq = async ({ question, ...restData }) => {
  try {
    const checkQuestionAvailability = await FaqsModel.checkQuestionAvailability(
      question
    );

    if (checkQuestionAvailability) {
      return makeRespObj({
        status_code: 400,
        message: "Faq creation failed.",
        error: {
          question: "This question already exists",
        },
      });
    }

    const createFaqResult = await FaqsModel.createFaq({
      question,
      ...restData,
    });

    if (createFaqResult) {
      return makeRespObj({
        status_code: 201,
        message: "Faq has been created successfully.",
        data: createFaqResult,
      });
    } else {
      return makeRespObj({
        status_code: 400,
        message: "Failed to create the faq.",
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const getAllFaqsAdminData = async () => {
  try {
    const fetchFaqsData = await FaqsModel.fetchFaqsAdminData();
    if (fetchFaqsData) {
      return makeRespObj({
        status_code: 200,
        message: "Data found successfully",
        data: {
          faqs: fetchFaqsData,
        },
      });
    } else {
      return makeRespObj({
        status_code: 404,
        message: "Data not found",
        data: {
          faqs: [],
        },
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};
const getAllFaqsUserData = async () => {
  try {
    const fetchFaqsData = await FaqsModel.fetchFaqsUserData();
    if (fetchFaqsData) {
      return makeRespObj({
        status_code: 200,
        message: "Data found successfully",
        data: {
          faqs: fetchFaqsData,
        },
      });
    } else {
      return makeRespObj({
        status_code: 404,
        message: "Data not found",
        data: {
          faqs: [],
        },
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const updateFaq = async ({ faqId, question, ...restArgs }) => {
  try {
    if (!faqId) {
      return makeRespObj({
        status_code: 400,
        message: "Failed to update faq!",
      });
    }

    const checkQuestionAvailability = await FaqsModel.checkQuestionAvailability(
      question,
      faqId
    );

    if (checkQuestionAvailability) {
      return makeRespObj({
        status_code: 400,
        message: "Failed to update faq!",
        error: {
          question: "This question already exists",
        },
      });
    }

    const updatedFaqResult = await FaqsModel.updateFaq(faqId, {
      question,
      ...restArgs,
    });

    if (updatedFaqResult) {
      return makeRespObj({
        status_code: 200,
        message: "Faq updated successfully",
        data:updatedFaqResult
      });
    } else {
      return makeRespObj({
        status_code: 400,
        message: "Failed to update faq!",
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const deleteFaq = async ({ faqId }) => {
  try {
    if (!faqId) {
      return makeRespObj({
        status_code: 400,
        message: "Failed to delete faq!",
      });
    }
    const deleteFaq = await FaqsModel.deleteFaq(faqId);

    if (deleteFaq) {
      return makeRespObj({
        status_code: 200,
        message: "Faq deleted successfully.",
      });
    } else {
      return makeRespObj({
        status_code: 400,
        message: "Failed to delete Faq!",
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const changeFaqStatus = async ({ faqId, isActive }) => {
  try {

      const updateFaq = await FaqsModel.updateFaq(faqId, {
          isActive,
      })

      if (updateFaq) {
          return makeRespObj({
              status_code: 200,
              message: "Faq Status change successfully",
          })
      } else {
          return makeRespObj({
              status_code: 200,
              message: "Failed to change Faq Status",
          })
      }
  } catch (error) {
      return makeRespObj({
          status_code: 500,
          catchErr: error,
      })
  }
}


const updateFaqPosition = async ({ faq_position }) => {
  try {
    if (faq_position !== undefined && faq_position !== null) {
      let idArray = JSON.parse(faq_position);

      if (idArray.length === 0) {
        return {
          status: false,
          status_code: 400,
          message: "Failed to change position",
        };
      }

      let counter = 0;
      for (const faq of idArray) {
        await FaqsModel.updateFaq(faq.faqId, {
          shortOrder: counter,
        });
        counter++; // Increment the counter by 1
      }

      return {
        status: true,
        status_code: 200,
        message: "Position changed successfully",
      };
    } else {
      return {
        status: false,
        status_code: 400,
        message: "Failed to change position",
      };
    }
  } catch (error) {
    return {
      status: false,
      status_code: 500,
      message: "An unexpected error occurred",
      error: { server_error: "An unexpected error occurred" },
      data: null,
    };
  }
};

module.exports = {
  createFaq,
  getAllFaqsAdminData,
  getAllFaqsUserData,
  updateFaq,
  deleteFaq,
  updateFaqPosition,
  changeFaqStatus
};
