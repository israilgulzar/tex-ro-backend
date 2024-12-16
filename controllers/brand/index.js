const brandModel = require("../../models/brandModel/brand");
const { pageMaker, makeRespObj } = require("../../AppUtils/");
const { fetchProductsByBrand } = require("../../models/productModel/product");

const createBrand = async ({ brandName, brandImage, isActive }) => {
  try {
    let errorObj = {};
    const fetchBrandFilterData = await brandModel.fetchBrandFilterData({
      brandName: brandName,
    });

    if (fetchBrandFilterData !== null) {
      errorObj = {
        brandName: "This brandName already exists",
        ...errorObj,
      };

      return makeRespObj({
        status_code: 400,
        message: "Brand creation failed.",
        error: errorObj,
      });
    }

    const createBrandResult = await brandModel.createBrand({
      brandName,
      brandImage,
      isActive,
    });

    return createBrandResult
      ? makeRespObj({
          status_code: 201,
          message: "Brand has been created successfully.",
          data: createBrandResult,
        })
      : makeRespObj({
          status_code: 400,
          message: "Failed to create brand.",
        });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const getBrandData = async ({ search, startToken, endToken }) => {
  try {
    const { page, perPage } = pageMaker({ startToken, endToken });

    const brandData = await brandModel.fetchBrandData(search, page, perPage);
    const recordCount = await brandModel.fetchBrandCount(search);

    if (brandData) {
      return makeRespObj({
        status_code: 200,
        message: "Data found successfully",
        data: {
          brandData: brandData,
          recordCount: recordCount,
        },
      });
    } else {
      return makeRespObj({
        status_code: 404,
        message: "Data not found",
        data: { brandData: [], recordCount: 0 },
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const getBrandDataCus = async ({ search, startToken, endToken }) => {
  try {
    const { page, perPage } = pageMaker({ startToken, endToken });

    const brandData = await brandModel.fetchBrandDataCus(search, page, perPage);

    const recordCount = await brandModel.fetchBrandCountCus(search);

    if (brandData) {
      return makeRespObj({
        status_code: 200,
        message: "Data found successfully",
        data: {
          brandData: brandData,
          recordCount: recordCount,
        },
      });
    } else {
      return makeRespObj({
        status_code: 404,
        message: "Data not found",
        data: { brandData: brandData, recordCount: 0 },
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};
const getUsedBrands = async ({ search, startToken, endToken }) => {
  try {
    const { page, perPage } = pageMaker({ startToken, endToken });

    const brandData = await brandModel.findUsedBrands(search, page, perPage);

    if (brandData) {
      return makeRespObj({
        status_code: 200,
        message: "Data found successfully",
        data: {
          brandData: brandData,
          recordCount: brandData?.length,
        },
      });
    } else {
      return makeRespObj({
        status_code: 404,
        message: "Data not found",
        data: { brandData: brandData, recordCount: 0 },
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const updateBrand = async ({ brandId, brandName, brandImage, isActive }) => {
  try {
    if (brandName) {
      const existingBrand = await brandModel.fetchBrandFilterData({
        brandName: brandName,
      });

      if (existingBrand && existingBrand._id.toString() !== brandId) {
        return makeRespObj({
          status_code: 403,
          message: "This brandName already exists",
        });
      }
    }

    const updatedBrand = await brandModel.updateBrand(brandId, {
      brandName,
      brandImage,
      isActive,
    });

    if (updatedBrand) {
      return makeRespObj({
        status_code: 200,
        message: "Brand updated successfully",
        data: updatedBrand,
      });
    } else {
      return makeRespObj({
        status_code: 400,
        message: "Failed to update brand",
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const changeBrandStatus = async ({ brandId, isActive }) => {
  try {
    const updatedBrand = await brandModel.updateBrand(brandId, {
      isActive,
    });

    if (updatedBrand) {
      return makeRespObj({
        status_code: 200,
        message: "Brand status changed successfully",
        data: updatedBrand,
      });
    } else {
      return makeRespObj({
        status_code: 400,
        message: "Failed to change brand status",
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const getBrandById = async ({ brandId }) => {
  try {
    const getBrandById = await brandModel.fetchBrandById(brandId);

    if (getBrandById) {
      return makeRespObj({
        status_code: 200,
        message: "Data found successfully",
        data: getBrandById,
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

const deleteBrand = async ({ brandId }) => {
  try {

    const isUsed = await fetchProductsByBrand(brandId);
    console.log("isUsed",isUsed)
    if(isUsed){
      return makeRespObj({
        status_code: 400,
        message: "This brand is used in other products and cannot be deleted.",
      });
    }

    const deleteBrandResult = await brandModel.updateBrand(brandId, {
      isDeleted: true,
    });

    if (deleteBrandResult) {
      return makeRespObj({
        status_code: 200,
        message: "Brand deleted successfully",
      });
    } else {
      return makeRespObj({
        status_code: 400,
        message: "Failed to delete brand",
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const brandDropdown = async ({ search, startToken, endToken }) => {
  try {
    const { page, perPage } = pageMaker({ startToken, endToken });

    const fetchBrandData = await brandModel.brandDropdown(
      search,
      page,
      perPage
    );

    const recordCount = await brandModel.fetchBrandCountCus(search);

    if (fetchBrandData) {
      return makeRespObj({
        status_code: 200,
        message: "Data found successfully",
        data: fetchBrandData,
        recordCount: recordCount,
      });
    } else {
      return makeRespObj({
        status_code: 404,
        message: "Data not found",
        data: { brandData: [], recordCount: 0 },
      });
    }
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
   
  }
  
};

module.exports = {
  createBrand,
  getBrandData,
  getBrandDataCus,
  updateBrand,
  changeBrandStatus,
  getBrandById,
  deleteBrand,
  brandDropdown,
  getUsedBrands
};
