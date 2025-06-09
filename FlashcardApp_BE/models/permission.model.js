const mongoose = require("mongoose");
const permission_schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date,
    },
    {
        timestamps: true
    }
);
const Permission = mongoose.model("Permission", permission_schema, "permissions");
module.exports = Permission;