const GitCardModel = require("../../models/giftCardModel/giftCard");

const { makeRespObj } = require("../../AppUtils");

const giftCardDetails = async ({ giftCardId, ...restData }) => {
  try {
    const createOrUpdateGiftCardDetail =
      await GitCardModel.createOrUpdateGiftCard({
        giftCardId,
        ...restData,
      });
    if (createOrUpdateGiftCardDetail?.duplicateCheck) {
      return makeRespObj({
        status_code: 400,
        message: "Same name gift card already exists.",
      });
    }

    if (createOrUpdateGiftCardDetail) {
      return makeRespObj({
        status_code: 200,
        message: giftCardId
          ? "Gif card updated successfully"
          : "Gif card added successfully",
        data: createOrUpdateGiftCardDetail,
      });
    }
    return makeRespObj({
      status_code: 400,
      message: "Failed to add gift card details",
    });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};
const checkGiftCardExisting = async (data) => {
  try {
    const check = await GitCardModel.checkGiftCardExisting(data);
    if (check) {
      return makeRespObj({
        status_code: 400,
        message: "Gift cart name already existing!",
        error: { name: "Gift cart name already existing!" },
      });
    }
    return makeRespObj({
      status_code: 200,
      message: "Duplicate gift card not found",
    });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};
const deleteGiftCard = async (giftCardId) => {
  try {
    const result = await GitCardModel.deleteGiftCard(giftCardId);

    if (result) {
      return makeRespObj({
        status_code: 200,
        message: "Gif card deleted successfully.",
      });
    }
    return makeRespObj({
      status_code: 400,
      message: "Failed to delete gift card.",
    });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};
const updateGiftCardStatus = async ({ giftCardId, status }) => {
  try {
    const result = await GitCardModel.giftCardStatusChanged(giftCardId, status);

    if (result) {
      return makeRespObj({
        status_code: 200,
        message: "Gif card status changed successful.",
      });
    }
    return makeRespObj({
      status_code: 400,
      message: "Failed to change gift card status.",
    });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};
const giftCardDropdown = async (args) => {
  try {
    const result = await GitCardModel.fetchGiftCardDropdown(args);

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

const getGiftCardList = async (args) => {
  try {
    const result = await GitCardModel.fetchGiftCardList(args);

    if (result) {
      return makeRespObj({
        status_code: 200,
        message: "Gift cards get successfully.",
        data: result,
      });
    }
    return makeRespObj({
      status_code: 400,
      message: "Failed to get gift cards.",
    });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};
const getSingleGiftCardProducts = async (args) => {
  try {
    const result = await GitCardModel.getSingleGiftCardProducts(args);

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
const getSingleGiftCard = async (giftCardId) => {
  try {
    const result = await GitCardModel.getSingleGiftCard(giftCardId);

    if (result) {
      return makeRespObj({
        status_code: 200,
        message: "Gif card get successfully.",
        data: result,
      });
    }
    return makeRespObj({
      status_code: 400,
      message: "Failed to get Gif card.",
    });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

module.exports = {
  giftCardDetails,
  updateGiftCardStatus,
  deleteGiftCard,
  giftCardDropdown,
  getGiftCardList,
  getSingleGiftCardProducts,
  checkGiftCardExisting,
  getSingleGiftCard,
};
