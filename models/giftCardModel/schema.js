const mongoose = require("mongoose");

const giftCardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Assuming you have a Product model
      },
    ],
  },
  {
    timestamps: true, // Auto-manages createdAt and updatedAt
    toJSON: { virtuals: true, versionKey: false }, // Remove __v
    toObject: { virtuals: true, versionKey: false }, // Remove __v
  }
);
giftCardSchema.index({ name: 1 });
giftCardSchema.index({ title: 1 });

const GiftCard = mongoose.model("GiftCard", giftCardSchema);

module.exports = GiftCard;
