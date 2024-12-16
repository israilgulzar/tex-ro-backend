// models/review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  orderId: { type: String, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  stars: { type: Number, required: true },
  reviewText: { type: String },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  giftCard: { type: mongoose.Schema.Types.ObjectId, ref: "GiftCard" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);
