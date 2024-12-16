const GiftCardSchema = require("./schema");
const mongoose = require("mongoose");

const createOrUpdateGiftCard = async (data) => {
  const { giftCardId, name } = data;

  try {
    // Proceed with creating or updating the gift card
    return await GiftCardSchema.findOneAndUpdate(
      { _id: giftCardId || new mongoose.Types.ObjectId() },
      data,
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error("Error in createOrUpdateGiftCard:", err);
    return null;
  }
};

const checkGiftCardExisting = async (data) => {
  const { giftCardId, name } = data;

  try {
    // Proceed with creating or updating the gift card
    return await GiftCardSchema.findOne({
      name,
      ...(giftCardId
        ? { _id: { $ne: new mongoose.Types.ObjectId(giftCardId) } }
        : {}),
    });
  } catch (err) {
    console.error("Error in createOrUpdateGiftCard:", err);
    return null;
  }
};

const giftCardStatusChanged = async (giftCardId, status) => {
  try {
    return await GiftCardSchema.findOneAndUpdate(
      { _id: giftCardId, isDeleted: false },
      { isActive: status === "Active" }
    );
  } catch (error) {
    return null;
  }
};

const deleteGiftCard = async (giftCardId) => {
  try {
    return await GiftCardSchema.findOneAndUpdate(
      { _id: giftCardId },
      { isDeleted: true }
    );
  } catch (error) {
    return null;
  }
};

const getSingleGiftCardProducts = async (giftCardId) => {
  try {
    return await GiftCardSchema.findOne({
      _id: giftCardId,
      isDeleted: false,
    })
      .select("products")
      .populate({
        path: "products", // Populate `products` from the Product model
        match: { isActive: true, isDeleted: false },
        select: "name asin image", // Fields to include in the populated data
      });
  } catch (err) {
    console.error("Error fetching survey:", err);
    return null;
  }
};
const getSingleGiftCard = async (giftCardId) => {
  try {
    return await GiftCardSchema.findOne({
      _id: giftCardId,
      isDeleted: false,
    }).select("-isDeleted");
  } catch (err) {
    console.error("Error fetching survey:", err);
    return null;
  }
};

const fetchGiftCardList = async ({ status, search, page = 1, limit = 10 }) => {
  let searchFilter = [{ isDeleted: false }]; // Always include the isDeleted filter

  if (status === "Active" || status === "Inactive") {
    searchFilter.push({ isActive: status === "Active" });
  }

  if (search) {
    searchFilter.push({
      $or: [{ name: { $regex: ".*" + search + ".*", $options: "i" } }],
    });
  }

  try {
    const giftCards = await GiftCardSchema.find(
      { $and: searchFilter },
      { isDeleted: 0 }
    )
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get the total count of matching records
    const recordCount = await GiftCardSchema.countDocuments({
      $and: searchFilter,
    });

    return {
      giftCards,
      recordCount,
    };
  } catch (err) {
    console.error("Error fetching gift card:", err);
    return null;
  }
};

const getGiftCardList = async ({ status, search, page = 1, limit = 10 }) => {
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
    const products = await GiftCardSchema.find(
      { $and: searchFilter },
      { isDeleted: 0 }
    )
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get the total count of matching records
    const recordCount = await GiftCardSchema.countDocuments({
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

module.exports = {
  createOrUpdateGiftCard,
  fetchGiftCardList,
  deleteGiftCard,
  getSingleGiftCardProducts,
  getSingleGiftCard,
  checkGiftCardExisting,
  giftCardStatusChanged,
};
