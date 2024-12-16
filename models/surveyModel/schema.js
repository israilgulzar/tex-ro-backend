const mongoose = require("mongoose");

// Define the schema for the Survey
const surveySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    startedCount: {
      type: Number,
      default: 0,
    },
    completedCount: {
      type: Number,
      default: 0,
    },
    starLength: {
      type: Number, // In seconds or milliseconds as required
      required: true,
    },
    reviewLength: {
      type: Number, // Minimum number of characters for review
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Assuming you're attaching products from a 'Product' model
      },
    ],

    qrCode: {
      type: String, // You can store the QR code URL or base64 string here
    },
    timeDelay: {
      type: Number, // Time delay for enabling next button (in milliseconds)
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Auto-manages createdAt and updatedAt
    toJSON: { virtuals: true, versionKey: false }, // Remove __v
    toObject: { virtuals: true, versionKey: false }, // Remove __v
  }
);

// Create indexes for better query performance
surveySchema.index({ isActive: 1 }); // Index on isActive for filtering by active status
surveySchema.index({ isDeleted: 1 }); // Index on isDeleted for filtering by deleted status
surveySchema.index({ surveyName: 1 }); // Index on surveyName for search by name
surveySchema.index({ startedCount: 1 }); // Index on startedCount for queries by progress
surveySchema.index({ completedCount: 1 }); // Index on completedCount for queries by progress
surveySchema.index({ createdAt: -1 }); // Index on createdAt for sorting by creation date (descending)

surveySchema.index({ surveyName: 1, isActive: 1 }); // Compound index for querying active surveys by name

module.exports = mongoose.model("Survey", surveySchema);
