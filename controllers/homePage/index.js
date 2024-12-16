const CategoryModel = require("../../models/categoryModel/category")
const BrandModel = require("../../models/brandModel/brand")
const ProductModel = require("../../models/productModel/product")
const { pageMaker, makeRespObj } = require("../../AppUtils/")

const categoryList = async () => {
    try {
        const fetchCategoryData = await CategoryModel.homePageCategory()

        if (fetchCategoryData) {
            return makeRespObj({
                status_code: 200,
                message: "Data found successfully",
                data: fetchCategoryData,
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
const categoryListByProductType = async (type) => {
  try {
    const getProductData = await ProductModel.fetchProductsByType(type);

    if (getProductData) {
      return makeRespObj({
        status_code: 200,
        message: "Data found successfully",
        data: getProductData,
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

const getBrandData = async () => {
    try {
        const brandData = await BrandModel.findUsedBrands()

        if (brandData) {
            return makeRespObj({
                status_code: 200,
                message: "Data found successfully",
                data: brandData,
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


const getProductData = async ({
    search,
    startToken,
    endToken,
    isFilterBy,
    priceRange,
    maxPrice,
    minPrice,
    categoryFilters,
    brandIds,
    productType
}) => {
    try {

        const { page, perPage } = pageMaker({ startToken, endToken })

        let getProductData
        let recordCount

        if (isFilterBy === 0 && !productType) {
            const {fetchProductAllData, recordCount:count} = await ProductModel.fetchProductAllData(
                search,
                page,
                perPage,
                categoryFilters,
            )
            getProductData = fetchProductAllData
            recordCount = count
        } else if (productType <=3) {
            const { fetchProductAllData, recordCount: count } =
              await ProductModel.fetchProductAllData(
                search,
                page,
                perPage,
                categoryFilters,
                productType
              );
            getProductData = fetchProductAllData;
            recordCount = count;

     
        } else if (isFilterBy === 4) {
            getProductData = await ProductModel.variantPriceData(
                search,
                startToken,
                endToken,
                priceRange,
                maxPrice,
                minPrice
            )
      
        } else {
            return makeRespObj({
                status_code: 400,
                message: "Invalid isFilterBy value. Use 0, 1, 2, 3, 4,5 or 6.",
            })
        }

        // getProductData.sort((a, b) => {
        //     if (a.parentProductData) return -1
        //     if (b.parentProductData) return 1
        //     return 0
        // })

        if (getProductData) {
            return makeRespObj({
                status_code: 200,
                message: "Data found successfully",
                data: getProductData,
                others:getProductData?.length>0?{recordCount}:{recordCount:0}
            })
        } else {
            return makeRespObj({
                status_code: 200,
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

const getProduct = async ({ search, startToken, endToken, badgeType, categoryFilters }) => {
    try {
        const { page, perPage } = pageMaker({ startToken, endToken })

        let getProductData

        if (badgeType === 1) {
            const newArrivalProduct = await ProductModel.newArrivalProduct(
                search,
                page,
                perPage,
                categoryFilters
            )
            getProductData = newArrivalProduct
        } else if (badgeType === 2) {
            const trendingNow = await ProductModel.trendingNow(
                search,
                page,
                perPage
            )
            getProductData = trendingNow
        } else if (badgeType === 3) {
            const bestSeller = await ProductModel.bestSeller(
                search,
                page,
                perPage
            )
            getProductData = bestSeller
        } else {
            return makeRespObj({
                status_code: 400,
                message: "Invalid badgeType value. Use  1, 2, 3.",
            })
        }

        if (getProductData) {
            return makeRespObj({
                status_code: 200,
                message: "Data found successfully",
                data: getProductData,
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

module.exports = {
    categoryList,
    getBrandData,
    getProductData,
    getProduct,
    categoryListByProductType,
}
