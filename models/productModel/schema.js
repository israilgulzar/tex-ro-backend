const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    asin: { type: String, required: true, unique: true },
    image: { type: String, default: "placeholder.jpg" },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, // Auto-manages createdAt and updatedAt
    toJSON: { virtuals: true, versionKey: false }, // Remove __v
    toObject: { virtuals: true, versionKey: false }, // Remove __v
  }
);

// Indexes for performance
productSchema.index({ asin: 1 });
productSchema.index({ name: 1 });

// Static method to find active products
productSchema.statics.findActive = function () {
  return this.find({ isDeleted: false });
};

module.exports = mongoose.model("Product", productSchema);
