const TestimonialModel = require("../../models/testimonialModel/testimonial")
const { pageMaker, makeRespObj } = require("../../AppUtils")

const createTestimonial = async (testimonial) => {
    try {
        
        const createTestimonialResult = await TestimonialModel.createTestimonial(testimonial)

        if (createTestimonialResult) {
            return makeRespObj({
                status_code: 201,
                message: "Testimonial created successfully.",
                data: createTestimonialResult,
            })
        } else {
            return makeRespObj({
                status_code: 400,
                message: "Failed to create Testimonial. ",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: "Failed to create Testimonial. An error occurred." + error,
        })
    }
}

const getTestimonialData = async ({ search, startToken, endToken }) => {
    try {
        const { page, perPage } = pageMaker({ startToken, endToken })

        const getTestimonialData = await TestimonialModel.fetchTestimonialData(
            false,
            page,
            perPage
        )

        const testimonialCountResult = await TestimonialModel.testimonialCount(search)
        if (getTestimonialData !== null && testimonialCountResult !== null) {
            return makeRespObj({
                status_code: 200,
                message: "Data found successfully",
                data: {
                    testimonialData: getTestimonialData,
                    totalCount: testimonialCountResult,
                },
            })
        } else {
            return makeRespObj({
                status_code: 404,
                message: "Data not found",
                data: {
                    testimonialData: [],
                    totalCount: 0,
                },
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}
const getTestimonialDataClient = async ({ startToken, endToken }) => {
    try {
        const { page, perPage } = pageMaker({ startToken, endToken })

        const getTestimonialData = await TestimonialModel.fetchTestimonialData(
            true,
            page,
            perPage
        )

        const testimonialCountResult = await TestimonialModel.testimonialCount()
        if (getTestimonialData !== null && testimonialCountResult !== null) {
            return makeRespObj({
                status_code: 200,
                message: "Data found successfully",
                data: {
                    testimonialData: getTestimonialData,
                    totalCount: testimonialCountResult,
                },
            })
        } else {
            return makeRespObj({
                status_code: 404,
                message: "Data not found",
                data: {
                    testimonialData: [],
                    totalCount: 0,
                },
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const updateTestimonial = async ({ testimonialId, userId, adminID, ...testimonial } ) => {
    try {

        const testimonialToUpdate = await TestimonialModel.fetchTestimonialById(
            testimonialId
        )

        if (!testimonialToUpdate) {
            return makeRespObj({
                status_code: 404,
                message: "Testimonial not found",
            })
        }

        if (testimonialToUpdate?.userData?.toString() !== userId || !adminID) {
            return makeRespObj({
                status_code: 403,
                message: "You are not authorized to update this Testimonial",
            })
        }

        const updatedTestimonial = await TestimonialModel.updateTestimonial(
          testimonialId,
          testimonial
        );

        if (updatedTestimonial) {
            return makeRespObj({
                status_code: 200,
                message: "Testimonial updated successfully",
                data: updatedTestimonial,
            })
        } else {
            return makeRespObj({
                status_code: 400,
                message: "Failed to update Testimonial",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const getTestimonialById = async ({ testimonialId }) => {
    try {
        const getTestimonialData = await TestimonialModel.fetchTestimonialById(
            testimonialId
        )
        if (getTestimonialData) {
            return makeRespObj({
                status_code: 200,
                message: "Data get successful",
                data: getTestimonialData,
            })
        } else {
            return makeRespObj({
                status_code: 400,
                message: "Data not found!",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const deleteTestimonial = async ({ testimonialId }) => {
    try {

        const deletedTestimonial = await TestimonialModel.deleteTestimonial(testimonialId)

        if (deletedTestimonial) {
            return makeRespObj({
                status_code: 200,
                message: "Testimonial deleted successfully",
            })
        } else {
            return makeRespObj({
                status_code: 400,
                message: "Failed to delete Testimonial",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const changeTestimonialStatus = async ({ testimonialId, isActive }) => {
    try {
  
        const updateTestimonial = await TestimonialModel.updateTestimonial(testimonialId, {
            isActive,
        })
  
        if (updateTestimonial) {
            return makeRespObj({
                status_code: 200,
                message: "Testimonial Status change successfully",
            })
        } else {
            return makeRespObj({
                status_code: 200,
                message: "Failed to change Testimonial Status",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
  }

  const updateTestimonialPosition = async ({ testimonial_position }) => {
    try {
      if (testimonial_position !== undefined && testimonial_position !== null) {
        let idArray = JSON.parse(testimonial_position);
  
        if (idArray.length === 0) {
          return {
            status: false,
            status_code: 400,
            message: "Failed to change position",
          };
        }
  
        let counter = 0;
        for (const testimonial of idArray) {
          await TestimonialModel.updateTestimonial(testimonial.testimonialId, {
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
  createTestimonial,
  getTestimonialData,
  getTestimonialDataClient,
  updateTestimonial,
  getTestimonialById,
  deleteTestimonial,
  updateTestimonialPosition,
  changeTestimonialStatus
};
