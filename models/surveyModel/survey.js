const SurveySchema = require("./schema");
const mongoose = require("mongoose");

const surveyCheck = async (data) => {
  const { surveyId, name } = data;
  try {
    return await SurveySchema.findOne({
      $or: [{ name: { $regex: `^${name}$`, $options: "i" } }], // Case-insensitive match
      isDeleted: false, // Filter out deleted records
      ...(surveyId
        ? { _id: { $ne: new mongoose.Types.ObjectId(surveyId) } }
        : {}),
    });
  } catch (err) {
    return null;
  }
};

const createOrUpdateSurvey = async (data) => {
  const { surveyId } = data;
  try {
    return await SurveySchema.findOneAndUpdate(
      { _id: surveyId || new mongoose.Types.ObjectId() },
      data,
      { upsert: true, new: true }
    );
  } catch (err) {
    return null;
  }
};

const surveyStatusChanged = async (surveyId, status) => {
  try {
    return await SurveySchema.findOneAndUpdate(
      { _id: surveyId, isDeleted: false },
      { isActive: status === "Active" }
    );
  } catch (error) {
    return null;
  }
};

const deleteSurvey = async (surveyId) => {
  try {
    return await SurveySchema.findOneAndUpdate(
      { _id: surveyId },
      { isDeleted: true }
    );
  } catch (error) {
    return null;
  }
};

const getSingleSurveyProducts = async (surveyId) => {
  try {
    return await SurveySchema.findOne({
      _id: surveyId,
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
const getSingleSurvey = async (surveyId) => {
  try {
    return await SurveySchema.findOne({
      _id: surveyId,
      isDeleted: false,
    }).select("-isDeleted");
  } catch (err) {
    console.error("Error fetching survey:", err);
    return null;
  }
};

const fetchSurveyList = async ({ status, search, page = 1, limit = 10 }) => {
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
    const surveys = await SurveySchema.find(
      { $and: searchFilter },
      { isDeleted: 0 }
    )
      // .populate({
      //   path: "products",
      //   select: "name asin image", // Fields to retrieve from the Product model
      // })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get the total count of matching records
    const recordCount = await SurveySchema.countDocuments({
      $and: searchFilter,
    });

    return {
      surveys,
      recordCount,
    };
  } catch (err) {
    console.error("Error fetching products:", err);
    return null;
  }
};

const fetchSurveyDropdown = async ({ search, page = 1, limit = 10 }) => {
  // Build search filter
  let searchFilter = [{ isActive: true }, { isDeleted: false }];
  if (search) {
    searchFilter.push({
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { title: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    });
  }

  try {
    // Query the database
    return await SurveySchema.find(
      { $and: searchFilter },
      { _id: 1, name: 1, image: 1, products: 1 } // Projection: Select specific fields
    )
      .populate({
        path: "products",
        select: "name asin image", // Fields to retrieve from the Product model
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  } catch (err) {
    console.error("Error fetching survey:", err);
    return null; // Return null in case of an error
  }
};

module.exports = {
  createOrUpdateSurvey,
  fetchSurveyDropdown,
  fetchSurveyList,
  surveyCheck,
  deleteSurvey,
  getSingleSurveyProducts,
  getSingleSurvey,
  surveyStatusChanged,
};
