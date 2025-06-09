const express = require('express');
const authMiddleWare = require("../../middlewares/authenticate.middleware");
const controller = require("../../controllers/admin/user.controller");
const router = express.Router();


router.get("/", authMiddleWare.checkAccessToken("Admin"), controller.getAllUserInfo);

router.get("/:userId", authMiddleWare.checkAccessToken("Admin"), authMiddleWare.checkPermission(["READ_USER"]) , controller.getUserInfo);

router.patch("/:userId", authMiddleWare.checkAccessToken("Admin"), authMiddleWare.checkPermission(["UPDATE_USER"]) , controller.changeUserInfo);

router.delete("/:userId", authMiddleWare.checkAccessToken("Admin"), authMiddleWare.checkPermission(["DELETE_USER"]) , controller.deleteUser);
module.exports = router;