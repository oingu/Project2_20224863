const mongoose = require("mongoose");

const role_schema = new mongoose.Schema(
    {
        title: String,
        description: String,
        permissions: {
            type: Array,
            default: []
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

const Role = mongoose.model("Role", role_schema, "roles");
module.exports = Role;