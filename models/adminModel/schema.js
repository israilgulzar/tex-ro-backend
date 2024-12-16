const mongoose = require("mongoose")

const Schema = mongoose.Schema

const AdminSchema = new Schema(
    {
        name: String,
        email: String,
        password: String,
        isDeleted: {
            type: Boolean,
            default: false,
        },
        createdAt: { type: Date, default: Date.now },
    },
    { versionKey: false }
)

module.exports = mongoose.model("admin", AdminSchema)
