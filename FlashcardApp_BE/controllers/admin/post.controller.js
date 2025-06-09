//Models
const Post = require("../../models/post.model");

// [GET] /api/v1/admin/posts?limit=x&page=y&filter=createAt&order=asc
module.exports.getAllPosts = async (req, res) => {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit =
        parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const { filter = "createdAt", order = "asc" } = req.query;
    const sortFields = ["createdAt", "updatedAt", "deleted"];
    const sortFilter = sortFields.includes(filter) ? filter : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;
    try {
        const posts = await Post.find({
            deleted: false,
        })
            .limit(limit)
            .select("-__v")
            .skip(skip)
            .sort({ [sortFilter]: sortOrder });
        const postsCount = await Post.countDocuments({
            deleted: false,
        });
        return res.status(200).json({
            message: "Get posts successfully",
            data: {
                totalCount: postsCount,
                currentPage: page,
                totalPages: Math.ceil(postsCount / limit),
                posts: posts,
            }
            
        });
    } catch (error) {
        console.error(`[GET /api/v1/admin/posts] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [GET] /api/v1/admin/posts/:slug
module.exports.getPost = async (req, res) => {
    const { slug } = req.params;
    try {
        const post = await Post.findOne({
            slug: slug,
            deleted: false,
        }).select("-__v");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json({
            message: "Get post successfully",
            data: post,
        });
    } catch (error) {
        console.error(`[GET /api/v1/admin/posts/${slug}] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [POST] /api/v1/admin/posts
module.exports.createPost = async (req, res) => {
    const { title, description, content, thumbnail = "" } = req.body;
    try {
        const isExistingPost = await Post.findOne({
            title: title,
            deleted: false
        });
        if (isExistingPost) {
            return res.status(400).json({
                message: "Post with this title already exists",
            });
        }
        const newPost = new Post({
            title,
            description,
            content,
            thumbnail,
        });
        await newPost.save();
        const postObj = newPost.toObject();
        delete postObj.__v;
        delete postObj._id;
        return res.status(201).json({
            message: "Create post successfully",
            data: postObj,
        });
    } catch (error) {
        console.error(`[POST /api/v1/admin/posts] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [PATCH] /api/v1/admin/posts/:slug
module.exports.updatePost = async (req, res) => {
    const { slug } = req.params;
    const {
        title = "",
        description ,
        content ,
        thumbnail = "",
        active = "active",
    } = req.body;
    try {
        const post = await Post.findOne({
            slug: slug,
            deleted: false,
            status: active,
        });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const isExistingPost = await Post.findOne({
            title: title,
            deleted: false,
        });
        if (isExistingPost && isExistingPost._id !== post._id) {
            return res.status(400).json({
                message: "Post with this title already exists",
            });
        }
        if (typeof title !== "undefined" && title !== "") {
            post.title = title;
        }
        if (typeof description !== "undefined") {
            post.description = description;
        }
        if (typeof content !== "undefined") {
            post.content = content;
        }
        if (typeof thumbnail !== "undefined") {
            post.thumbnail = thumbnail;
        }
        await post.save();
        return res.status(200).json({
            message: "Updated Post Successfully",
            data: post,
        });
    } catch (error) {
        console.error(`[PATCH /api/v1/admin/posts/${slug}] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [DELETE] /api/v1/admin/posts/:slug
module.exports.deletePost = async (req, res) => {
    const {slug} = req.params;
    try {
        const post = await Post.findOne({
            slug: slug,
            deleted: false,
        });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        post.deleted = true;
        await post.save();
        return res.status(200).json({
            message: "Deleted Post Successfully",
            data: post,
        });
    } catch (error) {
        console.error(`[DELETE /api/v1/admin/posts/${slug}] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
}