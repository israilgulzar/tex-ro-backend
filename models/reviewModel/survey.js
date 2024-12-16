const Product = require("./schema")
const mongoose = require("mongoose")
const createProduct = async (insertData) => {
    try {
        const product = new Product(insertData)
        const productResult = await product.save()
        return productResult
    } catch (err) {
        return null
    }
}

const fetchProductbyId = async (productId) => {
    const productData = await Product.findOne({
        _id: productId,
        isDeleted: false,
    })
        .then((data) => {
            return data
        })
        .catch((err) => {
            return null
        })
    return productData
}
const fetchProductsByType = async (type) => {
    try {
        // Aggregate pipeline to retrieve product data grouped by category and subcategory
        const pipeline = [
          {
            $match: { isActive: true, isDeleted: false, ...type }, // Filter out inactive, deleted, and specific product types
          },
          {
            $lookup: {
              from: "subcategories",
              localField: "subCategoryData",
              foreignField: "_id",
              as: "subCategory",
            },
          },
          {
            $match: { "subCategory.isActive": true }, // Filter out inactive subcategories
          },
          {
            $lookup: {
              from: "categories",
              localField: "subCategory.categoryData",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $match: { "category.isActive": true }, // Filter out inactive categories
          },
          {
            $group: {
              _id: {
                categoryId: "$subCategory.categoryData",
                subCategoryId: "$subCategory._id",
              },
              categoryName: { $first: "$category.categoryName" },
              subCategoryName: { $first: "$subCategory.subCategoryName" },
            },
          },
          {
            $group: {
              _id: "$_id.categoryId",
              categoryName: { $first: "$categoryName" },
              subCategories: {
                $push: {
                  subCategoryId: "$_id.subCategoryId",
                  subCategoryName: "$subCategoryName",
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              categoryId: "$_id",
              categoryName: 1,
              subCategories: 1,
            },
          },
        ];
    
        const productDataByCategory = await Product.aggregate(pipeline);
    
        // Convert single-value arrays to single values
        productDataByCategory.forEach(category => {
          category.categoryName = category.categoryName[0];
          category.categoryId = category.categoryId[0];
          category.subCategories.forEach(subCategory => {
            subCategory.subCategoryId = subCategory.subCategoryId[0];
            subCategory.subCategoryName = subCategory.subCategoryName[0];
          });
        });
    
        return productDataByCategory;
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
}

const updateProduct = async (productId, updateData) => {
    const productResult = Product.updateOne({ _id: productId }, updateData)
        .then((model) => {
            return true
        })
        .catch((err) => {
            return false
        })

    return productResult
}

const productManagement = (productId, updateData) => {
    return Product.findOneAndUpdate({ _id: productId }, updateData, {
        new: true,
    })
        .then((updatedProduct) => {
            if (updatedProduct) {
                return updatedProduct
                  .populate({
                    path: "subCategoryData brandData parentProductData",
                  })
                  .then((populatedProduct) => {
                    return populatedProduct.populate({
                      path: "variantPriceData",
                      populate: {
                        path: "variantData",
                        model: "Variant",
                        select: "variantType",
                      },
                    });
                  });
            } else {
                return null
            }
        })
        .catch((err) => {
            console.log(err)
            return null
        })
}

const fetchBrandData = (search, start, limit) => {
    const searchFilter = []

    if (search !== "") {
        searchFilter.push({
            name: {
                $regex: ".*" + search + ".*",
                $options: "i",
            },
        })
    }

    searchFilter.push({
        isDeleted: false,
    })

    const query = {
        parentProductData: null,
        stepFlag: 3,
        brandData: { $exists: true },
    }

    if (searchFilter.length > 0) {
        query.$and = searchFilter
    }

    return Product.find(query)

        .populate({
            path: "subCategoryData",
            select: "subCategoryName",
            match: {
                $and: [{ isDeleted: false }, { isActive: true }],
            },
            populate: {
                path: "categoryData",
                model: "Category",
                select: "categoryName",
                match: { isDeleted: false },
            },
        })

        .populate({
            path: "brandData",
            select: "brandName",
            match: { isDeleted: false },
        })
        .populate({
            path: "variantPriceData",
            select: [
                "variantData",
                "price",
                "oldPrice",
                "sliderImages",
                "discounts",
                "stock",
            ],
            populate: {
                path: "variantData",
                model: "Variant",
                select: "variantType",
                match: { isDeleted: false },
            },
        })
        .sort({ createdAt: -1 })
        .skip(start)
        .limit(limit)
        .then((productData) => {
            return productData
        })
        .catch((error) => {
            return null
        })
}

const fetchProductAllData = async(search, start, limit, categoryData, productType) => {
    try {
        
        let searchFilter = []
        if (search !== "") {
            searchFilter.push({
                $or: [
                    {
                        name: {
                            $regex: ".*" + search + ".*",
                            $options: "i",
                        },
                    },
                ],
            })
        }
    
        searchFilter.push({
            isDeleted: false,
        })
        if(categoryData?.length>0){
            searchFilter.push({
                subCategoryData:{$in : categoryData}
            })
        }
        if(productType){
            searchFilter.push({
                productType
            })
            searchFilter.push({
                isActive:true
            })
        }
        // recordCount
        const query = searchFilter.length > 0 ? { $and: searchFilter } : {}
        const recordCount = await Product.countDocuments(query)
        const fetchProductAllData = await Product.find(query)
    
            .populate({
                path: "subCategoryData",
                select: "subCategoryName",
                match: {
                    $and: [{ isDeleted: false }, { isActive: true }],
                },
                populate: {
                    path: "categoryData",
                    model: "Category",
                    select: "categoryName",
                    match: { isDeleted: false },
                },
            })
    
            .populate({
                path: "brandData",
                select: "brandName",
                match: { isDeleted: false },
            })
    
            .populate({
                path: "variantPriceData",
                select: [
                    "variantData",
                    "price",
                    "oldPrice",
                    "sliderImages",
                    "discounts",
                    "stock",
                ],
                populate: {
                    path: "variantData",
                    model: "Variant",
                    select: "variantType",
                    match: { isDeleted: false },
                },
            })
            .populate("parentProductData")
            .skip(start)
            .limit(limit)
            return {fetchProductAllData,recordCount}
    } catch (error) {
        return null
    }
}

const onlyParentProductData = (search, start, limit) => {
    const searchFilter = []

    if (search !== "") {
        searchFilter.push({
            name: {
                $regex: ".*" + search + ".*",
                $options: "i",
            },
        })
    }

    searchFilter.push({
        isDeleted: false,
    })

    const query = {
        stepFlag: 3,
        parentProductData: { $exists: true },
    }

    if (searchFilter.length > 0) {
        query.$and = []

        if (searchFilter.length > 0) {
            query.$and.push({ $or: searchFilter })
        }
    }

    return Product.find(query)

        .populate({
            path: "subCategoryData",
            select: "subCategoryName",
            match: {
                $and: [{ isDeleted: false }, { isActive: true }],
            },
            populate: {
                path: "categoryData",
                model: "Category",
                select: "categoryName",
                match: { isDeleted: false },
            },
        })

        .populate({
            path: "brandData",
            select: "brandName",
            match: { isDeleted: false },
        })
        .populate({
            path: "variantPriceData",
            select: [
                "variantData",
                "price",
                "oldPrice",
                "sliderImages",
                "discounts",
                "stock",
            ],
            populate: {
                path: "variantData",
                model: "Variant",
                select: "variantType",
                match: {
                    $and: [{ isDeleted: false }, { isActive: true }],
                },
            },
        })
        .populate("parentProductData")
        .sort({ parentProductData: -1 })
        .skip(start)
        .limit(limit)
        .then((productData) => {
            return productData
        })
        .catch((error) => {
            return null
        })
}

const onlyTajData = (search, start, limit) => {
    const searchFilter = []

    if (search !== "") {
        searchFilter.push({
            name: {
                $regex: ".*" + search + ".*",
                $options: "i",
            },
        })
    }

    searchFilter.push({
        isDeleted: false,
    })

    const query = {
        parentProductData: { $exists: false },
        stepFlag: 3,
    }
    if (searchFilter.length > 0) {
        query.$and = searchFilter
    }

    return Product.find(query)

        .populate({
            path: "subCategoryData",
            select: "subCategoryName",
            match: {
                $and: [{ isDeleted: false }, { isActive: true }],
            },
            populate: {
                path: "categoryData",
                model: "Category",
                select: "categoryName",
                match: { isDeleted: false },
            },
        })

        .populate({
            path: "brandData",
            select: "brandName",
            match: { isDeleted: false },
        })

        .populate({
            path: "variantPriceData",
            select: [
                "variantData",
                "price",
                "oldPrice",
                "sliderImages",
                "discounts",
                "stock",
            ],
            populate: {
                path: "variantData",
                model: "Variant",
                select: "variantType",
                match: {
                    isDeleted: false,
                },
            },
        })
        .skip(start)
        .limit(limit)
        .then((productData) => {
            return productData
        })
        .catch((error) => {
            return null
        })
}

const deleteProduct = async (productId) => {
    const productResult = await Product.deleteOne({
        _id: productId,
    })
        .then((data) => {
            return data
        })
        .catch((err) => {
            return null
        })
    return productResult
}

const fetchProductById = (productId) => {
    return Product.findOne({
        _id: productId,
        isDeleted: false,
    })

        .populate({
            path: "subCategoryData",
            select: "subCategoryName",
            match: {
                $and: [{ isDeleted: false }, { isActive: true }],
            },
            populate: {
                path: "categoryData",
                model: "Category",
                select: "categoryName",
                match: { isDeleted: false },
            },
        })

        .populate({
            path: "brandData",
            select: "brandName",
            match: { isDeleted: false },
        })

        .populate({
            path: "variantPriceData",
            select: [
                "variantData",
                "price",
                "oldPrice",
                "sliderImages",
                "discounts",
                "stock",
            ],
            populate: {
                path: "variantData",
                model: "Variant",
                select: "variantType",
                match: {
                    isDeleted: false,
                },
            },
        })
        .populate("parentProductData")
        .then((productData) => {
            return productData
        })
        .catch((error) => {
            return null
        })
}
const fetchSimilarProducts = async (
  subCategories = [],
  minPrice = 0,
  maxPrice = Infinity,
  page = 1,
  limit = 4
) => {
  try {
    console.log(subCategories, minPrice, maxPrice, page, limit);
    const filter = {
      isActive: true,
      isDeleted: false,
      $or: [
        { subCategoryData: { $in: subCategories } },
        { "variantPriceData.price": { $gte: minPrice, $lte: maxPrice } },
      ],
    };

    const products = await Product.find(filter)
      .populate({
        path: "subCategoryData",
        select: "subCategoryName",
        match: {
          $and: [{ isDeleted: false }, { isActive: true }],
        },
        populate: {
          path: "categoryData",
          model: "Category",
          select: "categoryName",
          match: { $and: [{ isDeleted: false }, { isActive: true }] },
        },
      })

      .populate({
        path: "brandData",
        select: ["brandName"],
      })
      .populate({
        path: "variantPriceData",
        select: [
          "variantData",
          "price",
          "oldPrice",
          "sliderImages",
          "discounts",
          "stock",
        ],
        populate: {
          path: "variantData",
          model: "Variant",
          select: "variantType",
        },
      })
      .populate("parentProductData")
      .skip(page)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter); // Adjusted count query

    return { products, totalProducts };
  } catch (error) {
    console.log(error);
    return null;
  }
};
// const fetchSimilarProducts = async (
//   subCategories = [],
//   minPrice = 0,
//   maxPrice = Infinity,
//   page = 1,
//   limit = 4,
// ) => {
//   try {
//     console.log(subCategories,  minPrice, maxPrice, page, limit);
//     const matchStage = {
//         $match: {
//           isActive: true,
//           isDeleted: false,
//         },
//       };
//       const filterStage = {
//         $match: {
//           $or: [
//             { subCategoryData: { $in: subCategories } },
//             { "variantPriceData.price": { $gte: minPrice, $lte: maxPrice } },
//           ],
//         },
//       };
  
     
      
//       const aggregationPipeline = [matchStage, filterStage];
      
      
//       // Pagination logic using skip and limit stages (optional)
//       console.log(JSON.stringify(aggregationPipeline))
      
//         aggregationPipeline.push({ $skip: page });
//         aggregationPipeline.push({ $limit: limit });
  
//       const products = await Product.aggregate(aggregationPipeline);
//       const totalProducts = await Product.countDocuments(matchStage.$match); // Adjusted count query

//     return { products, totalProducts };
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };
  

const fetchCategoryData = async (
    search,
    start,
    limit,
    categoryIds,
    subcategoryIds
) => {
    try {
        const searchFilter = []
        const categoryFilter = []

        if (search !== "") {
            searchFilter.push({
                name: {
                    $regex: ".*" + search + ".*",
                    $options: "i",
                },
            })
        }

        searchFilter.push({
            isDeleted: false,
        })

        if (Array.isArray(categoryIds) && categoryIds.length > 0) {
            categoryFilter.push({
                "subCategoryData.categoryData": {
                    $in: categoryIds,
                },
            })
        }

        if (Array.isArray(subcategoryIds) && subcategoryIds.length > 0) {
            searchFilter.push({
                subCategoryData: {
                    $in: subcategoryIds,
                },
            })
        } else if (Array.isArray(categoryIds) && categoryIds.length > 0) {
            searchFilter.push({
                "subCategoryData.categoryData": {
                    $in: categoryIds,
                },
            })
        }

        const query = {
            $or: [{ $and: searchFilter }, { $and: categoryFilter }],
        }

        const productData = await Product.find(query)
            .populate({
                path: "subCategoryData",
                select: "subCategoryName",
                match: {
                    $and: [{ isDeleted: false }, { isActive: true }],
                },
                populate: {
                    path: "categoryData",
                    model: "Category",
                    select: "categoryName",
                    match: { $and: [{ isDeleted: false }, { isActive: true }] },
                },
            })

            .populate({
                path: "brandData",
                select: ["brandName"],
            })
            .populate({
                path: "variantPriceData",
                select: [
                    "variantData",
                    "price",
                    "oldPrice",
                    "sliderImages",
                    "discounts",
                    "stock",
                ],
                populate: {
                    path: "variantData",
                    model: "Variant",
                    select: "variantType",
                },
            })
            .populate("parentProductData")
            .skip(start)
            .limit(limit)

        return productData
    } catch (error) {
        return null
    }
}

const fetchBrandIds = (search, start, limit, brandIds) => {
    const searchFilter = []

    if (search !== "") {
        searchFilter.push({
            name: {
                $regex: ".*" + search + ".*",
                $options: "i",
            },
        })
    }

    searchFilter.push({
        isDeleted: false,
    })

    const query = {
        stepFlag: 3,
    }

    searchFilter.push({
        brandData: brandIds,
    })

    if (searchFilter.length > 0) {
        query.$and = searchFilter
    }

    return Product.find(query)
        .populate({
            path: "brandData",
            select: "brandName",
            match: { isDeleted: false },
        })
        .populate({
            path: "variantPriceData",
            select: [
                "variantData",
                "price",
                "oldPrice",
                "sliderImages",
                "discounts",
                "stock",
            ],
            populate: {
                path: "variantData",
                model: "Variant",
                select: "variantType",
                match: { isDeleted: false },
            },
        })
        .populate("parentProductData")
        .sort({ createdAt: -1 })
        .skip(start)
        .limit(limit)
        .then((productData) => {
            return productData
        })
        .catch((error) => {
            return null
        })
}

const updateProductById = ({ productId, ...updateData }) => {
    return Product.findByIdAndUpdate(productId, updateData, { new: true })
        .then((updatedProduct) => {
            return updatedProduct.populate({
                path: "brandData variantPriceData parentProductData",
            })
        })
        .catch((err) => {
            return null
        })
}

const variantPriceData = async (search, start, limit, maxPrice, minPrice) => {
    try {
        // Match stage for filtering documents
        const matchStage = {
            $match: {
                // Add your search criteria here
                // For example:
                name: { $regex: ".*" + search + ".*", $options: "i" },
                isDeleted: false,
                "variantPriceData.price": { $gte: minPrice || 0, $lte: maxPrice || Infinity }
            }
        };

        // Lookup stage for populating nested data
        const lookupStage = {
            $lookup: {
                from: "variantprices", // Name of the referenced model (collection)
                localField: "variantPriceData", // Field in the parent model (collection)
                foreignField: "_id", // Field in the referenced model (collection)
                as: "variantPriceData" // Output array field
            }
        };

        // Aggregate pipeline for retrieving and populating data
        const countPipeline = [
            lookupStage,
            matchStage,
        ];
        const aggregatePipeline = [
            lookupStage,
            matchStage,
            { $skip: start }, // Skip documents for pagination
            { $limit: limit } // Limit the number of documents returned
        ];
        
        // Execute the pipeline to get the total count
        const countResult = await Product.aggregate(countPipeline);
        // Retrieve products with populated data
        const productData = await Product.aggregate(aggregatePipeline);

        return { products: productData, total: countResult?.length };
    } catch (error) {
        console.log(error);
        return null;
    }
}

// const productFiltersData = async (
//     search = '',
//     categories = [],
//     subCategories = [],
//     brands = [],
//     minPrice = 0,
//     maxPrice = Infinity,
//     page = 1,
//     limit = 10,
//     productType = 0
//   ) => {
//     try {
//       console.log(categories, subCategories, brands, minPrice, maxPrice, page, limit);
  
//       // Build the query object based on provided filters
//       const query = { isActive: true, isDeleted: false };
  
//       // Add search filter
//       let searchFilter = [];
//       if (search !== "") {
//         searchFilter.push({
//           $or: [
//             {
//               name: {
//                 $regex: ".*" + search + ".*",
//                 $options: "i",
//               },
//             },
//           ],
//         });
//       }
//       if (searchFilter.length > 0) {
//         if (!query.$and) {
//           query.$and = [];
//         }
//         query.$and = [...query.$and, ...searchFilter];
//       }
  
//       // Add category filter
//       if (subCategories?.length > 0) {
//         query.subCategoryData = { $in: subCategories };
//       }
  
//       // Add brand filter
//       if (brands?.length > 0) {
//         query.brandData = { $in: brands };
//       }
  
//       // Add product type filter
//       if (productType > 0) {
//         query.productType = productType;
//       }
  
//       // Add price range filter
//       if (minPrice > 0) {
//         query["variantPriceData.price"] = { $gte: minPrice };
//       }
  
//       if (maxPrice < Infinity) {
//         query["variantPriceData.price"] = {
//           ...query["variantPriceData.price"],
//           $lte: maxPrice,
//         };
//       }
//       const finalQuery = [
//         { $match: query },
//         { $sort: { productType: 1 } },
//         { $group: { _id: "$productType", products: { $push: "$$ROOT" } } },
//         {
//           $project: {
//             products: {
//               $reduce: {
//                 input: "$products",
//                 initialValue: [],
//                 in: { $concatArrays: ["$$value", "$$this.products"] },
//               },
//             },
//           },
//         },
//         { $unwind: "$products" },
//         { $replaceRoot: { newRoot: "$products" } },
//       ]
//       console.log(JSON.stringify(finalQuery));
//       const sortedProducts = await Product.aggregate(finalQuery)
//         .skip(page)
//         .limit(limit);
  
//       const totalProducts = await Product.countDocuments(query);
  
//       return { products: sortedProducts, totalProducts };
//     } catch (error) {
//       console.error(error);
//       return null;
//     }
//   };
  

const productFiltersData = async (
    search='',
  categories = [],
  subCategories = [],
  brands = [],
  minPrice = 0,
  maxPrice = Infinity,
  page = 1,
  limit = 10,
  productType = 0
) => {
  try {
    console.log(categories,subCategories, brands, minPrice, maxPrice, page, limit);
    // Build the query object based on provided filters
    const query = { isActive: true, isDeleted: false };
    let searchFilter=[]
    if (search !== "") {
      searchFilter.push({
        $or: [
          {
            name: {
              $regex: ".*" + search + ".*",
              $options: "i",
            },
          },
        ],
      });
    }
    if (searchFilter.length > 0) {
        if (!query.$and) {
            query.$and = [];
          }
        query.$and = [...query.$and, ...searchFilter];
      }
    // if (categories?.length > 0) {
    //   query.subCategoryData.categoryData = { $in: categories };
    // }
    if (subCategories?.length > 0) {
      query.subCategoryData = { $in: subCategories };
    }

    if (brands?.length > 0) {
      query.brandData = { $in: brands };
    }
    if (productType > 0) {
      query.productType = productType;
    }

    if (minPrice > 0) {
      query["variantPriceData.price"] = { $gte: minPrice };
    }

    if (maxPrice < Infinity) {
      query["variantPriceData.price"] = {
        ...query["variantPriceData.price"],
        $lte: maxPrice,
      };
    }
    
    const products = await Product.find(query).populate({
        path: "subCategoryData",
        select: "subCategoryName",
        match: {
            $and: [{ isDeleted: false }, { isActive: true }],
        },
        populate: {
            path: "categoryData",
            model: "Category",
            select: "categoryName",
            match: { $and: [{ isDeleted: false }, { isActive: true }] },
        },
    })

    .populate({
        path: "brandData",
        select: ["brandName"],
    })
    .populate({
        path: "variantPriceData",
        select: [
            "variantData",
            "price",
            "oldPrice",
            "sliderImages",
            "discounts",
            "stock",
        ],
        populate: {
            path: "variantData",
            model: "Variant",
            select: "variantType",
        },
    })
    .populate("parentProductData").skip(page).limit(limit);
    // Calculate total number of products (optional for pagination info)
    const totalProducts = await Product.countDocuments(query);

    return { products, totalProducts };
  } catch (error) {
    console.log(error);
    return null;
  }
};
  

const homePageProduct = () => {
    return Product.find({ isDeleted: false })

        .populate({
            path: "subCategoryData",
            select: "subCategoryName",
            match: {
                $and: [{ isDeleted: false }, { isActive: true }],
            },
            populate: {
                path: "categoryData",
                model: "Category",
                select: "categoryName",
                match: { isDeleted: false },
            },
        })
        .populate({
            path: "brandData",
            select: "brandName",
            match: { isDeleted: false },
        })
        .populate({
            path: "variantPriceData",
            select: [
                "variantData",
                "price",
                "oldPrice",
                "sliderImages",
                "discounts",
                "stock",
            ],
            populate: {
                path: "variantData",
                model: "Variant",
                select: "variantType",
                match: {
                    $and: [{ isDeleted: false }, { isActive: true }],
                },
            },
        })
        .populate("parentProductData")

        .then((data) => {
            return data
        })
        .catch((error) => {
            return null
        })
}
const newArrivalProduct = async (
    search='',
    page = 1,
    limit = 10,
    categories = [],
) => {
  try {
    console.log(categories, page, limit);
    // Build the query object based on provided filters
    const query = { isActive: true, isDeleted: false };
    let searchFilter=[]
    if (search !== "") {
      searchFilter.push({
        $or: [
          {
            name: {
              $regex: ".*" + search + ".*",
              $options: "i",
            },
          },
        ],
      });
    }
    if (searchFilter.length > 0) {
        if (!query.$and) {
            query.$and = [];
          }
        query.$and = [...query.$and, ...searchFilter];
      }
    if (categories?.length > 0) {
      query.subCategoryData = { $in: categories };
    }
    
    query.badgeType = 1;
    
    console.log(query)
    const products = await Product.find(query).populate({
        path: "subCategoryData",
        select: "subCategoryName",
        match: {
            $and: [{ isDeleted: false }, { isActive: true }],
        },
        populate: {
            path: "categoryData",
            model: "Category",
            select: "categoryName",
            match: { $and: [{ isDeleted: false }, { isActive: true }] },
        },
    })

    .populate({
        path: "brandData",
        select: ["brandName"],
    })
    .populate({
        path: "variantPriceData",
        select: [
            "variantData",
            "price",
            "oldPrice",
            "sliderImages",
            "discounts",
            "stock",
        ],
        populate: {
            path: "variantData",
            model: "Variant",
            select: "variantType",
        },
    })
    .populate("parentProductData").skip(page).limit(limit);
    // Calculate total number of products (optional for pagination info)
    const totalProducts = await Product.countDocuments(query);

    return { products, totalProducts };
  } catch (error) {
    console.log(error);
    return null;
  }
};


const trendingNow = async (search, start, limit) => {
    try {
        let searchFilter = []
        if (search !== "") {
            searchFilter.push({
                $or: [
                    {
                        name: {
                            $regex: ".*" + search + ".*",
                            $options: "i",
                        },
                    },
                ],
            })
        }
    
        searchFilter.push({
            isDeleted: false,
        })
    
        searchFilter.push({
            stepFlag: 3,
            badgeType: 2,
        })
    
        const query = searchFilter.length > 0 ? { $and: searchFilter } : {}
        const count = await Product.countDocuments(query)
        const products = await Product.find(query)
    
            .populate({
                path: "subCategoryData",
                select: "subCategoryName",
                match: {
                    $and: [{ isDeleted: false }, { isActive: true }],
                },
                populate: {
                    path: "categoryData",
                    model: "Category",
                    select: "categoryName",
                    match: { isDeleted: false },
                },
            })
    
            .populate({
                path: "brandData",
                select: "brandName",
                match: { isDeleted: false },
            })
    
            .populate({
                path: "variantPriceData",
                select: [
                    "variantData",
                    "price",
                    "oldPrice",
                    "sliderImages",
                    "discounts",
                    "stock",
                ],
                populate: {
                    path: "variantData",
                    model: "Variant",
                    select: "variantType",
                    match: { isDeleted: false },
                },
            })
            .populate("parentProductData")
            .skip(start)
            .limit(limit)
            return {products, total:count}
        
    } catch (error) {
        return null
    }
}

const bestSeller = async (search, start, limit) => {
    try {
        
        let searchFilter = []
        if (search !== "") {
            searchFilter.push({
                $or: [
                    {
                        name: {
                            $regex: ".*" + search + ".*",
                            $options: "i",
                        },
                    },
                ],
            })
        }
    
        searchFilter.push({
            isDeleted: false,
        })
    
        searchFilter.push({
            stepFlag: 3,
            badgeType: 3,
        })
    
        const query = searchFilter.length > 0 ? { $and: searchFilter } : {}
        const count = await Product.countDocuments(query)
        const products = await  Product.find(query)
    
            .populate({
                path: "subCategoryData",
                select: "subCategoryName",
                match: {
                    $and: [{ isDeleted: false }, { isActive: true }],
                },
                populate: {
                    path: "categoryData",
                    model: "Category",
                    select: "categoryName",
                    match: { isDeleted: false },
                },
            })
    
            .populate({
                path: "brandData",
                select: "brandName",
                match: { isDeleted: false },
            })
    
            .populate({
                path: "variantPriceData",
                select: [
                    "variantData",
                    "price",
                    "oldPrice",
                    "sliderImages",
                    "discounts",
                    "stock",
                ],
                populate: {
                    path: "variantData",
                    model: "Variant",
                    select: "variantType",
                    match: { isDeleted: false },
                },
            })
            .populate("parentProductData")
            .skip(start)
            .limit(limit)
            return {products, total:count}

    } catch (error) {
        return null
    }
}

const fetchVariantPrice = (productId) => {
    return Product.findOne({
        _id: productId,
        isDeleted: false,
    })
        .populate({
            path: "variantPriceData",
            select: ["variantData", "price", "sliderImages", "discounts"],
        })
        .then((productData) => {
            return productData
        })
        .catch((error) => {
            return null
        })
}

const fetchProductForPayment = (productId) => {
    return Product.findOne({
        _id: productId,
        isDeleted: false,
    })

        .populate({
            path: "brandData",
            select: "brandName",
            match: { isDeleted: false },
        })

        .populate({
            path: "variantPriceData",
            select: ["variantData", "price", "oldPrice", "discounts", "stock"],
            populate: {
                path: "variantData",
                model: "Variant",
                select: "variantType",
                match: {
                    isDeleted: false,
                },
            },
        })
        .populate("parentProductData")
        .then((productData) => {
            return productData
        })
        .catch((error) => {
            return null
        })
}

const fetchProductCount = (search, status) => {
    const searchFilter = { isDeleted: false }

    if (search) {
        searchFilter.name = { $regex: ".*" + search + ".*", $options: "i" }
    }

    if (status !== undefined) {
        searchFilter.isActive = status
    }

    return Product.countDocuments(searchFilter)
        .then((productCount) => {
            return productCount
        })
        .catch((err) => {})
}

const fetchProductDropdown = async (search, start, limit) => {
    let searchFilter = []
    if (search !== "") {
        searchFilter.push({
            $or: [
                {
                    name: {
                        $regex: ".*" + search + ".*",
                        $options: "i",
                    },
                },
            ],
        })
    }

    searchFilter.push({ isActive: true })
    searchFilter.push({ isDeleted: false })
    // searchFilter.push({ brandData: { $eq: brandId } })

    const query = searchFilter.length > 0 ? { $and: searchFilter } : {}
    const getData = { _id: 1, name: 1 }
    return Product.find(query, getData)
        .sort({ createdAt: -1 })
        .skip(start)
        .limit(limit)
        .then((productData) => {
            return productData
        })
        .catch((err) => {
            return null
        })
}
const fetchCartProducts = async (productIds) => {
  try {
    const products = await Product.find({ 'variantPriceData._id': { $in: productIds } }).populate({
        path: "variantPriceData",
        select: [
            "variantData",
            "price",
            "oldPrice",
            "sliderImages",
            "discounts",
            "stock",
        ],
        populate: {
            path: "variantData",
            model: "Variant",
            select: "variantType",
        },
    });
    if (!products) {
      return null;
    }
    return products;
  } catch (error) {
    console.log(error);
    return null;
  }
};
const fetchVariantProducts = async (variantId) => {
  try {
    const products = await Product.find({ 'variantPriceData.variantData': variantId }).populate({
        path: "variantPriceData",
        select: [
            "variantData",
            "price",
            "oldPrice",
            "sliderImages",
            "discounts",
            "stock",
        ],
        populate: {
            path: "variantData",
            model: "Variant",
            select: "variantType",
        },
    });
    if (!products) {
      return null;
    }
    return products;
  } catch (error) {
    console.log(error);
    return null;
  }
};
const fetchProductsByBrand = async (brandData) => {
  try {
    const products = await Product.find({ brandData });
    if (!products || !products?.length) {
      return false;
    }
    return products;
  } catch (error) {
    console.log(error);
    return false;
  }
};
const fetchProductsByFilter = async (filter) => {
  try {
    const products = await Product.find(filter);
    if (!products) {
      return null;
    }
    return products;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
    createProduct,
    updateProduct,
    productManagement,
    fetchProductAllData,
    fetchBrandData,
    onlyParentProductData,
    onlyTajData,
    deleteProduct,
    fetchProductById,
    variantPriceData,
    fetchCategoryData,
    fetchBrandIds,
    updateProductById,
    homePageProduct,
    newArrivalProduct,
    trendingNow,
    bestSeller,
    fetchProductbyId,
    fetchVariantPrice,
    fetchProductForPayment,
    fetchProductCount,
    fetchProductDropdown,
    fetchProductsByType,
    productFiltersData,
    fetchSimilarProducts,
    fetchCartProducts,
    fetchVariantProducts,
    fetchProductsByBrand,
    fetchProductsByFilter
}
