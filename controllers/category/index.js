const CategoryModel = require("../../models/categoryModel/category");
const SubCategoryModel = require("../../models/subCategoryModel/subcategory");
const { pageMaker, makeRespObj } = require("../../AppUtils/");

const createCategory = async ({ categoryName, isActive, image }) => {
  try {
    let errorObj = {};
    const getCategoryData = await CategoryModel.filterCategoryData({
      categoryName: categoryName,
    });

    if (getCategoryData !== null) {
      errorObj = {
        categoryName: "This categoryName already exists",
        ...errorObj,
      };

      return makeRespObj({
        status_code: 400,
        message: "Category creation failed.",
        error: errorObj,
      });
    }

    const createCategoryResult = await CategoryModel.createCategory({
      categoryName,
      isActive,
      image,
    });

    if (createCategoryResult) {
      return makeRespObj({
        status_code: 201,
        message: "Category has been created successfully.",
        data: createCategoryResult,
      });
    } else {
      return makeRespObj({
        status_code: 400,
        message: "Failed to create the category.",
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const getCategoryData = async ({ search, startToken, endToken }) => {
  try {
    const { page, perPage } = pageMaker({ startToken, endToken });

    const fetchCategoryData = await CategoryModel.fetchCategoryData(
      search,
      page,
      perPage
    );
    const recordCount = await CategoryModel.fetchCategoryCount(search);
    if (fetchCategoryData) {
      return makeRespObj({
        status_code: 200,
        message: "Data found successfully",
        data: {
          categoryData: fetchCategoryData,
          recordCount: recordCount,
        },
      });
    } else {
      return makeRespObj({
        status_code: 404,
        message: "Data not found",
        data: {
          categoryData: [],
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

const customerCategoryList = async ({ search, startToken, endToken }) => {
  try {
    const { page, perPage } = pageMaker({ startToken, endToken });

    const fetchCategoryData = await CategoryModel.customerCategoryList(
      search,
      page,
      perPage
    );
    const recordCount = await CategoryModel.CusCategoryCount(search);
    if (fetchCategoryData) {
      return makeRespObj({
        status_code: 200,
        message: "Data found successfully",
        data: {
          categoryData: fetchCategoryData,
          recordCount: recordCount,
        },
      });
    } else {
      return makeRespObj({
        status_code: 404,
        message: "Data not found",
        data: {
          categoryData: [],
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

const updateCategory = async ({
  categoryId,
  categoryName,
  isActive,
  image,
}) => {
  try {
    let errorObj = {};

    if (categoryName) {
      const existingCategory = await CategoryModel.filterCategoryData({
        categoryName: categoryName,
      });

      if (existingCategory && existingCategory._id.toString() !== categoryId) {
        errorObj = {
          categoryName: "This categoryName already exists",
          ...errorObj,
        };

        return makeRespObj({
          status_code: 400,
          message: "Category updation failed.",
          error: errorObj,
        });
      }
    }

    const updatedCategory = await CategoryModel.updateCategory(categoryId, {
      categoryName,
      isActive,
      image,
    });

    if (updatedCategory) {
      return makeRespObj({
        status_code: 200,
        message: "Category updated successfully",
        data: updatedCategory,
      });
    } else {
      return makeRespObj({
        status_code: 400,
        message: "Failed to update category",
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const changeCategoryStatus = async ({ categoryId, isActive }) => {
  try {
    const updateCategory = await CategoryModel.updateCategory(categoryId, {
      isActive,
    });

    if (updateCategory) {
      return makeRespObj({
        status_code: 200,
        message: "category status change successfully.",
      });
    } else {
      return makeRespObj({
        status_code: 400,
        message: "failed to status change category ",
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const getCategoryById = async ({ categoryId }) => {
  try {
    const getCategoryData = await CategoryModel.fetchCategoryById(categoryId);
    if (getCategoryData) {
      return makeRespObj({
        status_code: 200,
        message: "Data found successfully",
        data: getCategoryData,
      });
    } else {
      return makeRespObj({
        status_code: 400,
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

const deleteCategory = async ({ categoryId }) => {
  try {
    // check whether the category is used in product or not
    let isHavingChilds = await SubCategoryModel.fetchSubCategorys(
      "",
      categoryId
    );
    if (isHavingChilds?.length > 0) {
      return makeRespObj({
        status_code: 400,
        message:
          "This Category is having other subcategories used in other products and cannot be deleted.",
      });
    }
    const deleteCategory = await CategoryModel.updateCategory(categoryId, {
      isDeleted: true,
    });

    if (deleteCategory) {
      return makeRespObj({
        status_code: 200,
        message: "category deleted successfully",
      });
    } else {
      return makeRespObj({
        status_code: 400,
        message: "Failed to delete category",
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const categoryDropdown = async ({ search, startToken, endToken }) => {
  try {
    const { page, perPage } = pageMaker({ startToken, endToken });

    const fetchCategoryData = await CategoryModel.categoryDropdown(
      search,
      page,
      perPage
    );

    if (fetchCategoryData) {
      return makeRespObj({
        status_code: 200,
        message: "Data found successfully",
        data: fetchCategoryData,
      });
    } else {
      return makeRespObj({
        status_code: 200,
        message: "Data not found",
        data: [],
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
    });
  }
};

const updateCategoryPosition = async ({ category_position }) => {
  try {
    if (category_position !== undefined && category_position !== null) {
      let idArray = JSON.parse(category_position);

      if (idArray.length === 0) {
        return {
          status: false,
          status_code: 400,
          message: "Failed to change position",
        };
      }
      // console.log("category_position", idArray);

      let counter = 0;
      for (const category of idArray) {
        await CategoryModel.updateCategory(category.categoryId, {
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

const getCategorysWithSubCategoryData = async () => {
  try {
    const getCategoryData = await CategoryModel.fetchCategoryList();

    let promiseData = null;
    let categoryData = [];
    let categoryIndexCount = 0;
    if (
      getCategoryData !== undefined &&
      getCategoryData !== null &&
      getCategoryData?.length > 0
    ) {
      promiseData = await new Promise(async (resolve, _) => {
        await getCategoryData.map(async (category, categoryIndex) => {
          categoryData[categoryIndex] = {
            _id: category._id,
            categoryName: category.categoryName,
            shortOrder: category.shortOrder,
            image: category?.image,
            isActive: category?.isActive,
            sub_category: [],
          };
          await new Promise(async (resolve, _) => {
            let subcategory = await SubCategoryModel.fetchSubCategorys(
              "",
              category._id
            );

            if (subcategory !== null) {
              categoryData[categoryIndex]["sub_category"] = subcategory;

              categoryIndexCount = categoryIndexCount + 1;
              await resolve(true);
            } else {
              categoryIndexCount = categoryIndexCount + 1;
              await resolve(true);
            }
          });

          if (getCategoryData?.length === categoryIndexCount) {
            await resolve(categoryData);
          }
        });
      });
    }

    if (getCategoryData !== null) {
      return {
        status: true,
        status_code: 200,
        message: "Data get successfully",
        data: promiseData,
      };
    } else {
      return {
        status: false,
        status_code: 404,
        message: "Data not found",
        data: null,
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

const getCategoriesAndSubCategories = async () => {
  try {
    const getCategoryData = await CategoryModel.fetchCategoryList();

    if (!getCategoryData || getCategoryData.length === 0) {
      return {
        status: false,
        status_code: 404,
        message: "No categories found",
        data: null,
      };
    }

    const categoryData = await Promise.all(
      getCategoryData.map(async (category) => {
        const subcategory = await SubCategoryModel.fetchSubCategorys(
          "",
          category._id
        );
        if (subcategory && subcategory.length > 0) {
          return {
            _id: category._id,
            categoryName: category.categoryName,
            shortOrder: category.shortOrder,
            image: category.image,
            sub_category: subcategory,
          };
        }
      })
    );

    const filteredCategories = categoryData.filter((category) => category);

    if (filteredCategories.length === 0) {
      return {
        status: false,
        status_code: 404,
        message: "No categories found with subcategories",
        data: null,
      };
    }

    return {
      status: true,
      status_code: 200,
      message: "Data retrieved successfully",
      data: filteredCategories,
    };
  } catch (error) {
    return {
      status: false,
      status_code: 500,
      message: "An unexpected error occurred",
      error: { server_error: error.message },
      data: null,
    };
  }
};

const getCategoriesWithSubCategoriesAndProductCount = async () => {
  try {
    const categoriesData =
      await CategoryModel.categoriesWithSubCategoriesAndProductCount();
    if (categoriesData) {
      return {
        status: true,
        status_code: 200,
        message: "Data retrieved successfully",
        data: categoriesData,
      };
    } else {
      return {
        status: false,
        status_code: 404,
        message: "No categories found with subcategories",
        data: null,
      };
    }
  } catch (error) {
    return {
      status: false,
      status_code: 500,
      message: "An unexpected error occurred",
      error: { server_error: error.message },
      data: null,
    };
  }
};

module.exports = {
  createCategory,
  getCategoryData,
  updateCategory,
  getCategoryById,
  deleteCategory,
  categoryDropdown,
  changeCategoryStatus,
  customerCategoryList,
  updateCategoryPosition,
  getCategorysWithSubCategoryData,
  getCategoriesAndSubCategories,
  getCategoriesWithSubCategoriesAndProductCount,
};
