const TagModel = require("../../models/tagModel/tag")
const { makeRespObj } = require("../../AppUtils")

const addTag = async ({ tagName }) => {
    try {
        const tagIdArray = []
        let errorObj = {}
        for (const tagData of tagName) {
            try {
                const existingTag = await TagModel.filterTagData({
                    tagName: tagData,
                })

                if (!existingTag) {
                    const createdTag = await TagModel.createTag({
                        tagName: tagData,
                        isActive: true,
                    })

                    tagIdArray.push({
                        tagName: tagData,
                        createdAt:createdTag.createdAt,
                        id: createdTag._id,
                    })
                } else {
                    errorObj = {
                        tagName: "tagName already exists",
                        ...errorObj,
                    }
                    return makeRespObj({
                        status_code: 400,
                        error: errorObj,
                    })
                }
            } catch (error) {
                return makeRespObj({
                    status_code: 500,
                    error: error,
                })
            }
        }
        return makeRespObj({
            status_code: 201,
            message: "Tag created successfully",
            data: tagIdArray,
        })
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            error: error,
        })
    }
}

const updateTag = async ({ id, tagName }) => {
    try {

        const getFilterData = await TagModel.filterTagData({ tagName: tagName })

        if (getFilterData !== null && getFilterData._id.toString() !== id) {
            return makeRespObj({
                status_code: 400,
                message: "Failed to update tag",
                error: { tagName: "tagName already exists." },
            })
        }

        const updateResult = await TagModel.updateTag(id, { tagName: tagName })

        if (updateResult) {
            return makeRespObj({
                status_code: 200,
                message: "Tag updated successfully",
            })
        } else {
            return makeRespObj({
                status_code: 400,
                message: "Failed to update tag",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            error: error,
        })
    }
}
const getTagDataById = async ({ id }) => {
    try {

        const getTagData = await TagModel.fetchTagById(id)

        if (getTagData !== null) {
            return makeRespObj({
                status_code: 200,
                message: "Data get successfully",
                data: getTagData,
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
            error: error,
        })
    }
}
const getTagsData = async ({ search, startToken, endToken, status }) => {
    try {

        const perPage = parseInt(endToken) || 10
        let page = Math.max((parseInt(startToken) || 1) - 1, 0)
        if (page !== 0) {
            page = perPage * page
        }

        const getTagData = await TagModel.fetchTags(
            search,
            page,
            perPage,
            status
        )
        const recordCount = await TagModel.fetchTagsCount(search, status)

        if (getTagData !== null) {
            return makeRespObj({
                status_code: 200,
                message: "Data get successfully",
                data: { getTagData: getTagData, recordCount: recordCount },
            })
        } else {
            return makeRespObj({
                status_code: 404,
                message: "Data not found",
                data: {
                    getTagData: [],
                    recordCount: 0,
                },
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            error: error,
        })
    }
}

const deleteTag = async ({ id }) => {
    try {

        const updateTag = await TagModel.updateTag(id, {
            isDeleted: true,
        })
        if (updateTag) {
            return makeRespObj({
                status_code: 200,
                message: "Tag deleted successfully",
            })
        } else {
            return makeRespObj({
                status_code: 400,
                message: "Failed to delete the tag",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            error: error,
        })
    }
}
const changeTagStatus = async ({ id, isActive }) => {
    try {

        const updateTag = await TagModel.updateTag(id, {
            isActive,
        })
        if (updateTag) {
            return makeRespObj({
                status_code: 200,
                message: "Tag status changed successfully",
            })
        } else {
            return makeRespObj({
                status_code: 400,
                message: "Failed to change tag status",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            error: error,
        })
    }
}
const searchTag = async ({ search }) => {
    try {

        const getTagData = await TagModel.searchTag(search)
        if (getTagData !== null) {
            return makeRespObj({
                status_code: 200,
                message: "Data get successfully",
                data: getTagData,
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
            error: error,
        })
    }
}

module.exports = {
    addTag,
    getTagsData,
    updateTag,
    getTagDataById,
    deleteTag,
    changeTagStatus,
    searchTag,
}
