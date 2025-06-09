const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const post_schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        thumbnail: {
            type: String,
            default: "",
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            default: "active",
        },
        slug: {
            type: String,
            slug: "title",
            unique: true
        }
    },
    {
        timestamps: true
    }
)


const Post = mongoose.model("Post", post_schema, "posts");

module.exports = Post;