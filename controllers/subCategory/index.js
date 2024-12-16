const SubCategoryModel = require("../../models/subCategoryModel/subcategory");
const { pageMaker, makeRespObj } = require("../../AppUtils/");
const { fetchProductsByFilter } = require("../../models/productModel/product");

const createSubCategory = async ({ categoryId, subCategoryName, isActive }) => {
  try {
    let errorObj = {};

    const getFilterData = await SubCategoryModel.filterSubCategoryData({
      subCategoryName: subCategoryName,
    });

    if (getFilterData !== null) {
      errorObj = {
        subCategoryName: "This subCategoryName already exists",
        ...errorObj,
      };

      return makeRespObj({
        status_code: 400,
        message: "SubCategory creation failed.",
        error: errorObj,
      });
    }

    const createSubCategoryResult = await SubCategoryModel.createSubCategory({
      categoryData: categoryId,
      subCategoryName,
      isActive,
    });

    if (createSubCategoryResult) {
      return makeRespObj({
        status_code: 201,
        message: "SubCategory has been created successfully.",
        data: createSubCategoryResult,
      });
    } else {
      return makeRespObj({
        status_code: 400,
        message: "Failed to create the subCategory.",
      });
    }
  } catch (err) {
    return makeRespObj({
      status_code: 500,
      catchErr: err,
    });
  }
};

const getSubCategoryData = async ({ search, startToken, endToken }) => {
  try {
    const { page, perPage } = pageMaker({ startToken, endToken });

    const getSubCategoryData = await SubCategoryModel.fetchSubCategoryData(
      search,
      page,
      perPage
    );
    const recordCount = await SubCategoryModel.subcategoryCount(search);

    if (getSubCategoryData) {
      return makeRespObj({
        status_code: 200,
        message: "Data found successfully",
        data: {
          subCategoryData: getSubCategoryData,
          recordCount: recordCount,
        },
      });
    } else {
      return makeRespObj({
        status_code: 404,
        message: "Data not found",
        data: {
          subCategoryData: [],
          recordCount: 0,
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

const getSubCategoryDataCus = async ({ search, startToken, endToken }) => {
  try {
    const { page, perPage } = pageMaker({ startToken, endToken });

    const getSubCategoryData = await SubCategoryModel.fetchSubCategoryDataCus(
      search,
      page,
      perPage
    );
    if (getSubCategoryData) {
      return makeRespObj({
        status_code: 200,
        message: "Data found successfully",
        data: getSubCategoryData,
      });
    } else {
      return makeRespObj({
        status_code: 404,
        message: "Data not found ",
        data: {
          subCategoryData: [],
          recordCount: 0,
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

const updateSubCategory = async ({
  subCategoryId,
  categoryId,
  subCategoryName,
  isActive,
}) => {
  try {
    if (subCategoryName) {
      const existingSubCategory = await SubCategoryModel.filterSubCategoryData({
        subCategoryName: subCategoryName,
      });

      if (
        existingSubCategory &&
        existingSubCategory._id.toString() !== subCategoryId
      ) {
        return makeRespObj({
          status_code: 400,
          message: "This subCategoryName already exists",
        });
      }
    }

    const updatedSubCategory = await SubCategoryModel.updateSubCategory(
      subCategoryId,
      {
        categoryData: categoryId,
        subCategoryName,
        isActive,
      }
    );

    if (updatedSubCategory) {
      return makeRespObj({
        status_code: 200,
        message: "SubCategory updated successfully.",
      });
    } else {
      return makeRespObj({
        status_code: 400,
        message: "Failed to update SubCategory",
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const changeSubCategoryStatus = async ({ subCategoryId, isActive }) => {
  try {
    const updateSubCategory = await SubCategoryModel.updateSubCategory(
      subCategoryId,
      {
        isActive,
      }
    );

    if (updateSubCategory) {
      return makeRespObj({
        status_code: 200,
        message: "subCategory status change successfully.",
        data: updateSubCategory,
      });
    } else {
      return makeRespObj({
        status_code: 400,
        message: "failed to status change subCategory ",
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const getSubCategoryById = async ({ subCategoryId }) => {
  try {
    const getSubCategoryById = await SubCategoryModel.fetchSubCategoryById(
      subCategoryId
    );

    return getSubCategoryById
      ? makeRespObj({
          status_code: 200,
          message: "Data get successful",
          data: getSubCategoryById,
        })
      : makeRespObj({
          status_code: 400,
          message: "Data get failed !",
        });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const deleteSubCategory = async ({ subCategoryId }) => {
  try {
    const isUsed = await fetchProductsByFilter({
      subCategoryData: subCategoryId,
    });
    if (isUsed?.length > 0) {
      return makeRespObj({
        status_code: 400,
        message:
          "This Sub category is used in other products and cannot be deleted.",
      });
    }

    const deleteSubCategory = await SubCategoryModel.updateSubCategory(
      subCategoryId,
      {
        isDeleted: true,
      }
    );

    if (deleteSubCategory) {
      return makeRespObj({
        status_code: 200,
        message: "subCategory deleted successfully",
      });
    } else {
      return makeRespObj({
        status_code: 400,
        message: "Failed to delete subCategory",
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const subCategoryDropdown = async ({
  categoryId,
  search,
  startToken,
  endToken,
}) => {
  try {
    const { page, perPage } = pageMaker({ startToken, endToken });

    const fetchSubCategoryData = await SubCategoryModel.subCategoryDropdown(
      categoryId,
      search,
      page,
      perPage
    );
    if (fetchSubCategoryData) {
      return makeRespObj({
        status_code: 200,
        message: "Data found successfully",
        data: fetchSubCategoryData,
      });
    } else {
      return makeRespObj({
        status_code: 404,
        message: "Data not found",
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const updateSubCategoryPosition = async ({ sub_category_position }) => {
  try {
    if (sub_category_position !== undefined && sub_category_position !== null) {
      let idArray = JSON.parse(sub_category_position);

      if (idArray.length === 0) {
        return {
          status: false,
          status_code: 400,
          message: "Failed to change position",
        };
      }

      let counter = 0;
      for (const subCategory of idArray) {
        await SubCategoryModel.updateSubCategory(subCategory.subCategoryId, {
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
  createSubCategory,
  getSubCategoryData,
  updateSubCategory,
  getSubCategoryById,
  deleteSubCategory,
  subCategoryDropdown,
  changeSubCategoryStatus,
  getSubCategoryDataCus,
  updateSubCategoryPosition,
};
