const mongoose = require('mongoose');
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const folder_schema = new mongoose.Schema(
    {
        name: {
            type: String, 
            required: true,
            trim: true,
            maxlength: 100
        },
        description: {
            type: String,
            default: "",
            maxlength: 500
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        tags: {
            type: [String],
            default: []
        },
        isPublic: {
            type: Boolean,
            default: false
        },
        isDefault: {
            type: Boolean,
            default: false
        },
        flashcardCount: {
            type: Number,
            default: 0
        },
        slug: {
            type: String,
            slug: "name",
            unique: true
        }
    },
    {
        timestamps: true
    }
);

const Folder = mongoose.model("Folder", folder_schema, "folders");
module.exports = Folder;