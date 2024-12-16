const OfferBannerModel = require("../../models/offerBannerModel/offerBanner")
const { makeRespObj } = require("../../AppUtils")

const createBanner = async ({ imageUrl, ...imageData }) => {
    try {

        const createBanner = await OfferBannerModel.createBanner({
            imageUrl,
            ...imageData,
        })

        if (createBanner) {
            return makeRespObj({
                status_code: 200,
                message: "Banner created successfully",
                data: createBanner,
            })
        } else {
            return makeRespObj({
                status_code: 400,
                message: "Banner created fail",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const getBannerData = async () => {
    try {
        const bannerData = await OfferBannerModel.fetchBannerData()

        if (bannerData) {
            return makeRespObj({
                status_code: 200,
                message: "Data found successfully",
                data: bannerData,
            })
        } else {
            return makeRespObj({
                status_code: 404,
                message: "Data not found",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const getBannerDataCus = async () => {
    try {
        const bannerData = await OfferBannerModel.fetchBannerDataCus()

        if (bannerData) {
            return makeRespObj({
                status_code: 200,
                message: "Data found successfully",
                data: bannerData,
            })
        } else {
            return makeRespObj({
                status_code: 404,
                message: "Data not found",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const updateBanner = async ({ bannerId, ...updateData }) => {
    try {

        const updateBanner = await OfferBannerModel.updateBanner(
            bannerId,
            { ...updateData }
        )

        if (updateBanner) {
            return makeRespObj({
                status_code: 200,
                message: "Banner updated successfully",
                data: updateBanner,
            })
        } else {
            return makeRespObj({
                status_code: 200,
                message: "failed to update Banner ",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const changeBannerStatus = async ({ bannerId }) => {
    try {

        const updateBanner = await OfferBannerModel.updateBannerStatus(bannerId);

        if (updateBanner) {
            return makeRespObj({
                status_code: 200,
                message: "Banner change Status successfully",
            })
        } else {
            return makeRespObj({
                status_code: 200,
                message: "failed to change Status Banner ",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const deleteBanner = async ({ bannerId }) => {
    try {

        const deleteBanner = await OfferBannerModel.deleteBanner(
            bannerId
        )

        if (deleteBanner) {
            return makeRespObj({
                status_code: 200,
                message: "Banner deleted successfully",
            })
        } else {
            return makeRespObj({
                status_code: 200,
                message: "Failed to delete Banner",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const updateBannerPosition = async ({  banner_position }) => {
    try {
      if (banner_position !== undefined && banner_position !== null) {
        let idArray = JSON.parse(banner_position);
  
        if (idArray.length === 0) {
          return {
            status: false,
            status_code: 400,
            message: "Failed to change position",
          };
        }
  
        let counter = 0;
        for (const banner of idArray) {
          await OfferBannerModel.updateBanner(banner.bannerId, {
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
  createBanner,
  getBannerData,
  getBannerDataCus,
  updateBanner,
  changeBannerStatus,
  deleteBanner,
  updateBannerPosition,
};
