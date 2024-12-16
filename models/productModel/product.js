const mongoose = require("mongoose");
const ProductSchema = require("./schema");
const SurveySchema = require("../surveyModel/schema");
const GiftCardSchema = require("../giftCardModel/schema");

const productCheck = async (data) => {
  const { productId, name } = data;

  try {
    return await ProductSchema.findOne({
      $or: [{ name: { $regex: `^${name}$`, $options: "i" } }], // Case-insensitive match
      isDeleted: false, // Filter out deleted records
      ...(productId
        ? { _id: { $ne: new mongoose.Types.ObjectId(productId) } }
        : {}),
    });
  } catch (err) {
    return null;
  }
};

const createOrUpdateProduct = async (data) => {
  const { productId } = data; // Extract relevant fields
  try {
    // Create or update product
    const product = await ProductSchema.findOneAndUpdate(
      { _id: productId || new mongoose.Types.ObjectId() }, // Match _id or create a new one
      data, // Update data
      { upsert: true, new: true } // Create if not found, return updated document
    );

    return product; // Return created or updated product
  } catch (err) {
    return err;
  }
};

const getSingleProduct = async (surveyId) => {
  try {
    return await ProductSchema.findOne({
      _id: surveyId,
      isDeleted: false,
      // ...(status && { isActive: status && "Active" }),
    }).select("-isDeleted");
  } catch (err) {
    console.error("Error fetching survey:", err);
    return null;
  }
};

const deleteProduct = async (productId) => {
  try {
    const query = {
      products: { $in: [productId] }, // Check if productId is in the array
      isDeleted: false, // Ensure the gift card is not deleted
    };
    const surveyReference = await SurveySchema.findOne(query);

    if (surveyReference) return { isExisting: true, module: "survey" };

    const giftCardReference = await GiftCardSchema.findOne(query);

    if (giftCardReference) {
      return { isExisting: true, module: "gift card" };
    }

    return await ProductSchema.findOneAndUpdate(
      { _id: productId },
      { isDeleted: true }
    );
  } catch (error) {
    return error;
  }
};

const fetchProductList = async ({ status, search, page = 1, limit = 10 }) => {
  let searchFilter = [{ isDeleted: false }]; // Always include the isDeleted filter

  if (status === "Active" || status === "Inactive") {
    searchFilter.push({ isActive: status === "Active" });
  }

  if (search) {
    searchFilter.push({
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { asin: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    });
  }

  try {
    // Get the product list
    const products = await ProductSchema.find(
      { $and: searchFilter },
      { isDeleted: 0 }
    )
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get the total count of matching records
    const recordCount = await ProductSchema.countDocuments({
      $and: searchFilter,
    });

    return {
      products,
      recordCount,
    };
  } catch (err) {
    console.error("Error fetching products:", err);
    return null;
  }
};

const productStatusChanged = async (productId, status) => {
  try {
    return await ProductSchema.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      { isActive: status }
    );
  } catch (error) {
    return null;
  }
};

const fetchProductDropdown = async ({
  search,
  page = 1,
  limit = 10,
  filter,
  selectedProducts,
}) => {
  let searchFilter = [{ isDeleted: false }];

  if (search) {
    searchFilter.push({
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { asin: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    });
  }

  try {
    // Add the filter logic
    if (
      filter === "selected" &&
      selectedProducts &&
      selectedProducts.length > 0
    ) {
      // If the filter is 'selected', return only the products in the selectedProducts array
      searchFilter.push({
        _id: { $in: selectedProducts }, // Match products where _id is in selectedProducts
      });
    } else if (
      filter === "" &&
      selectedProducts &&
      selectedProducts.length > 0
    ) {
      // If no filter, but selectedProducts is provided, exclude the products in selectedProducts
      searchFilter.push({
        _id: { $nin: selectedProducts }, // Exclude products in selectedProducts
      });
    }

    // Query the database with the constructed filter
    return await ProductSchema.find(
      { $and: searchFilter },
      { _id: 1, name: 1, image: 1, asin: 1, isActive: 1 } // Projection: Select specific fields
    )
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  } catch (err) {
    console.error("Error fetching products:", err);
    return null; // Return null in case of an error
  }
};

module.exports = {
  createOrUpdateProduct,
  getSingleProduct,
  productCheck,
  fetchProductDropdown,
  fetchProductList,
  deleteProduct,
  productStatusChanged,
};
