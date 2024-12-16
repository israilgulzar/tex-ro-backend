const ProductModel = require("../../models/productModel/product");

const { makeRespObj } = require("../../AppUtils/");

const productCheck = async ({ productId, ...restData }) => {
  try {
    const check = await ProductModel.productCheck({
      productId,
      ...restData,
    });

    if (check) {
      return makeRespObj({
        status_code: 400,
        message: "Product name already existing!",
        error: { name: "Product name already existing!" },
      });
    }
    return makeRespObj({
      status_code: 200,
      message: "Duplicate product not found",
    });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const productDetails = async ({ productId, ...restData }) => {
  try {
    const createProductDetail = await ProductModel.createOrUpdateProduct({
      productId,
      ...restData,
    });

    if (createProductDetail) {
      return makeRespObj({
        status_code: 200,
        message: productId
          ? "Product updated successfully"
          : "Product added successfully",
        data: createProductDetail,
      });
    }
    return makeRespObj({
      status_code: 400,
      message: "Failed to add product details",
    });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};
const deleteProduct = async (productId) => {
  try {
    const result = await ProductModel.deleteProduct(productId);
    if (result.isExisting) {
      return makeRespObj({
        status_code: 400,
        message: "Product already attached with " + result.module,
      });
    }
    if (result) {
      return makeRespObj({
        status_code: 200,
        message: "Product deleted successfully.",
      });
    }
    return makeRespObj({
      status_code: 400,
      message: "Failed to delete product.",
    });
  } catch (error) {
    return makeRespObj({
      catchErr: error,
      status_code: 500,
    });
  }
};
const productDropdown = async (args) => {
  try {
    const result = await ProductModel.fetchProductDropdown(args);

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
const getProductList = async (args) => {
  try {
    const result = await ProductModel.fetchProductList(args);

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
const updateProductStatus = async ({ productId, status }) => {
  try {
    const result = await ProductModel.productStatusChanged(productId, status);

    if (result) {
      return makeRespObj({
        status_code: 200,
        message: "Product status changed successful.",
      });
    }
    return makeRespObj({
      status_code: 400,
      message: "Failed to change product status.",
    });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};
const getSingleProduct = async (surveyId) => {
  try {
    const result = await ProductModel.getSingleProduct(surveyId);

    if (result) {
      return makeRespObj({
        status_code: 200,
        message: "Product get successfully.",
        data: result,
      });
    }
    return makeRespObj({
      status_code: 400,
      message: "Failed to get product.",
    });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

module.exports = {
  productDetails,
  deleteProduct,
  getSingleProduct,
  updateProductStatus,
  productDropdown,
  getProductList,
  productCheck,
};
