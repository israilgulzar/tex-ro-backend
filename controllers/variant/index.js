const variantModel = require("../../models/variantModel/variant")
// const variantPriceModel = require("../../models/variantPriceModel/schema")
const ProductModel = require("../../models/productModel/product")

const { pageMaker, makeRespObj } = require("../../AppUtils/")

const createVariant = async ({ variantType, isActive }) => {
    try {

        let errorObj = {}
        const variantTypeFilter = await variantModel.variantTypeFilter({
            variantType: variantType,
        })
        if (variantTypeFilter !== null) {
            errorObj = {
                variantType: "This variantType Already Exists",
                ...errorObj,
            }

            return makeRespObj({
                status_code: 400,
                message: "variant creation failed.",
                error: errorObj,
            })
        }

        const createVariant = await variantModel.createVariant({
            variantType,
            isActive,
        })
        return (
            createVariant &&
            makeRespObj({
                status_code: 201,
                message: "Variant created successfully.",
                data: createVariant,
            })
        )
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const getVariantData = async ({ search, startToken, endToken }) => {
    try {
        const { page, perPage } = pageMaker({ startToken, endToken })

        const fetchVariantData = await variantModel.fetchVariantData(
            search,
            page,
            perPage
        )

        const recordCount = await variantModel.variantCount(search)
        if (fetchVariantData && recordCount) {
            return makeRespObj({
                status_code: 200,
                message: "Data found successfully",
                data: {
                    variantData: fetchVariantData,
                    recordCount: recordCount,
                },
            })
        } else {
            return makeRespObj({
                status_code: 404,
                message: "Data not found",
                data: {
                    variantData: [],
                    recordCount: 0,
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

const getVariantDataCus = async ({ search, startToken, endToken }) => {
    try {
        const { page, perPage } = pageMaker({ startToken, endToken })

        const fetchVariantData = await variantModel.fetchVariantDataCus(
            search,
            page,
            perPage
        )

        const recordCount = await variantModel.variantCountCus(search)
        if (fetchVariantData?.length > 0) {
            return makeRespObj({
                status_code: 200,
                message: "Data found successfully",
                data: {
                    variantData: fetchVariantData,
                    recordCount: recordCount,
                },
            })
        } else {
            return makeRespObj({
                status_code: 404,
                message: "Data not found",
                data: {
                    variantData: [],
                    recordCount: 0,
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

const updateVariant = async ({ variantId, variantType, isActive }) => {
    try {
        let errorObj
        const variantTypeFilter = await variantModel.variantTypeFilter({
            variantType: variantType,
        })
        if (variantTypeFilter && variantTypeFilter._id.toString() !== variantId) {
            errorObj = {
                variantType: "This variantType Already Exists",
                ...errorObj,
            }

            return makeRespObj({
                status_code: 400,
                message: "Failed to update Variant",
                error: errorObj,
            })
        }
        const updateVariant = await variantModel.updateVariant(variantId, {
            variantType,
            isActive,
        })

        if (updateVariant) {
            return makeRespObj({
                status_code: 200,
                message: "Variant updated successfully",
                data: updateVariant,
            })
        } else {
            return makeRespObj({
                status_code: 200,
                message: "failed to update Variant ",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const changeVariantStatus = async ({ variantId, isActive }) => {
    try {

        const updateVariant = await variantModel.updateVariant(variantId, {
            isActive,
        })

        if (updateVariant) {
            return makeRespObj({
                status_code: 200,
                message: "Variant change Status successfully",
            })
        } else {
            return makeRespObj({
                status_code: 200,
                message: "failed to change Status Variant ",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const getVariantById = async ({ variantId }) => {

    try {
        const getVariantById = await variantModel.fetchVariantById(variantId)
        return getVariantById
            ? makeRespObj({
                status_code: 200,
                message: "Data get successful",
                data: getVariantById,
            })
            : makeRespObj({
                status_code: 400,
                message: "Data get failed !",
            })
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const deleteVariant = async ({ variantId }) => {
    try {

        const variantPriceDocument = await ProductModel.fetchVariantProducts(variantId)

        if (variantPriceDocument?.length>0) {
            return makeRespObj({
                status_code: 400,
                message:
                    "This variant is used in other products and cannot be deleted.",
            })
        }

        const deleteVariant = await variantModel.updateVariant(variantId, {
            isDeleted: true,
        })

        if (deleteVariant) {
            return makeRespObj({
                status_code: 200,
                message: "Variant deleted successfully",
            })
        } else {
            return makeRespObj({
                status_code: 400,
                message: "Failed to delete Variant",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const variantDropdown = async ({ search, startToken, endToken }) => {
    try {

        const { page, perPage } = pageMaker({ startToken, endToken })

        const fetchVariantData = await variantModel.variantDropdown(
            search,
            page,
            perPage
        )
        const recordCount = await variantModel.variantCountCus(search)

        if (fetchVariantData) {
            return makeRespObj({
              status_code: 200,
              message: "Data found successfully",
              data: fetchVariantData,
              recordCount: recordCount,
            });
        } else {
            return makeRespObj({
                status_code: 404,
                message: "Data not found",
                data: {
                    variantData: [],
                    recordCount: 0,
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

module.exports = {
    createVariant,
    getVariantData,
    updateVariant,
    getVariantById,
    deleteVariant,
    variantDropdown,
    changeVariantStatus,
    getVariantDataCus,
}
