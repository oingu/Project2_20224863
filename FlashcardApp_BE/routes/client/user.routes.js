const express = require("express");
//Controllers
const controller = require("../../controllers/client/user.controller");
//Middlewares
const authMiddleWare = require("../../middlewares/authenticate.middleware");
const validateMiddleWare = require("../../middlewares/validate.middleware");
const { verifyEmailSchema, changeEmailSchema } = require("../../schemas/client/user.schema");
const router = express.Router();

router.get("/settings", authMiddleWare.checkAccessToken(), controller.setting);

router.patch(
    "/settings",
    authMiddleWare.checkAccessToken(),
    controller.settingPatch
);

router.delete(
    "/settings",
    authMiddleWare.checkAccessToken(),
    controller.settingDelete
);

router.post(
    "/email-change/request",
    authMiddleWare.checkAccessToken(),
    controller.changeEmailRequest
);

router.post(
    "/email-change/verify",
    validateMiddleWare.validateInput(verifyEmailSchema),
    authMiddleWare.checkAccessToken(),
    controller.changeEmailVerify
);

router.patch(
    "/email-change",
    validateMiddleWare.validateInput(changeEmailSchema),
    authMiddleWare.checkAccessToken(),
    controller.changeEmail
);

module.exports = router;
