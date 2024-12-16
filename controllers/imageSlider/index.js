const ImageSliderModel = require("../../models/imageSliderModel/imageslider")
const { makeRespObj } = require("../../AppUtils")

const createImageSlider = async ({ imageUrl, ...imageData }) => {
    try {

        const createImageSlider = await ImageSliderModel.createImageSlider({
            imageUrl,
            ...imageData,
        })

        if (createImageSlider) {
            return makeRespObj({
                status_code: 200,
                message: "imageSlider created successfully",
                data: createImageSlider,
            })
        } else {
            return makeRespObj({
                status_code: 400,
                message: "imageSlider created fail",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const getImageSliderData = async () => {
    try {
        const imageSliderData = await ImageSliderModel.fetchImageSliderData()

        if (imageSliderData) {
            return makeRespObj({
                status_code: 200,
                message: "Data found successfully",
                data: imageSliderData,
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

const getImageSliderDataCus = async () => {
    try {
        const imageSliderData = await ImageSliderModel.fetchImageSliderDataCus()

        if (imageSliderData) {
            return makeRespObj({
                status_code: 200,
                message: "Data found successfully",
                data: imageSliderData,
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

const updateImageSlider = async ({ imageSliderId, ...updateData }) => {
    try {

        const updateImageSlider = await ImageSliderModel.updateImageSlider(
            imageSliderId,
            { ...updateData }
        )

        if (updateImageSlider) {
            return makeRespObj({
                status_code: 200,
                message: "imageSlider updated successfully",
                data: updateImageSlider,
            })
        } else {
            return makeRespObj({
                status_code: 200,
                message: "failed to update imageSlider ",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const changeImageSliderStatus = async ({ imageSliderId, isActive }) => {
    try {

        const updateImageSlider = await ImageSliderModel.updateImageSlider(
            imageSliderId,
            {
                isActive,
            }
        )

        if (updateImageSlider) {
            return makeRespObj({
                status_code: 200,
                message: "imageSlider change Status successfully",
            })
        } else {
            return makeRespObj({
                status_code: 200,
                message: "failed to change Status imageSlider ",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const deleteImageSlider = async ({ imageSliderId }) => {
    try {

        const deleteImageSlider = await ImageSliderModel.deleteImageSlider(
            imageSliderId
        )

        if (deleteImageSlider) {
            return makeRespObj({
                status_code: 200,
                message: "imageSlider deleted successfully",
            })
        } else {
            return makeRespObj({
                status_code: 200,
                message: "Failed to delete imageSlider",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const updateSlidePosition = async ({ slide_position }) => {
    try {
      if (slide_position !== undefined && slide_position !== null) {
        let idArray = JSON.parse(slide_position);
  
        if (idArray.length === 0) {
          return {
            status: false,
            status_code: 400,
            message: "Failed to change position",
          };
        }
  
        let counter = 0;
        for (const slide of idArray) {
          await ImageSliderModel.updateImageSlider(slide.slideId, {
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
    createImageSlider,
    getImageSliderData,
    getImageSliderDataCus,
    updateImageSlider,
    changeImageSliderStatus,
    deleteImageSlider,
    updateSlidePosition
}
