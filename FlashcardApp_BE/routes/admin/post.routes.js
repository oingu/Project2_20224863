const express = require("express");
const multer = require("multer");
//Controllers
const controller = require("../../controllers/admin/post.controller");
//Middlewares
const authMiddleWare = require("../../middlewares/authenticate.middleware");
const validateMiddleWare = require("../../middlewares/validate.middleware");
//Schemas
const {postSchema} = require("../../schemas/admin/post.schema");

const fileUpload = multer();
const uploadCloud = require("../../middlewares/uploadCloud.middleware");

const router = express.Router();
router.get(
    "/",
    authMiddleWare.checkAccessToken("Admin"),
    authMiddleWare.checkPermission(["READ_POST"]),
    controller.getAllPosts
);

router.get(
    "/:slug",
    authMiddleWare.checkAccessToken("Admin"),
    authMiddleWare.checkPermission(["READ_POST"]),
    controller.getPost
);

router.post(
    "/",
    authMiddleWare.checkAccessToken("Admin"),
    authMiddleWare.checkPermission(["CREATE_POST"]),
    fileUpload.single("thumbnail"),
    uploadCloud.upload,
    validateMiddleWare.validateInput(postSchema),
    controller.createPost
);

router.patch(
    "/:slug",
    authMiddleWare.checkAccessToken("Admin"),
    authMiddleWare.checkPermission(["UPDATE_POST"]),
    fileUpload.single("thumbnail"),
    uploadCloud.upload,
    validateMiddleWare.validateInput(postSchema),
    controller.updatePost
);

router.delete(
    "/:slug",
    authMiddleWare.checkAccessToken("Admin"),
    authMiddleWare.checkPermission(["DELETE_POST"]),
    controller.deletePost
);

module.exports = router;
