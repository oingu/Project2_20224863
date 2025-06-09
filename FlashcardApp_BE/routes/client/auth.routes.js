const express = require("express");
//Controller
const controller = require("../../controllers/client/auth.controller");
//Middleware
const loginLimiter = require("../../limiters/loginLimiter");
const authMiddleWare = require("../../middlewares/authenticate.middleware");
const validateMiddleWare = require("../../middlewares/validate.middleware");
const router = express.Router();
// Joi validate schema
const {
    loginSchema,
    emailSchema,
    registerVerifySchema,
    changePassSchema,
    newPassSchema,
    registerOtpVerifySchema,
} = require("../../schemas/client/auth.schema");

router.post(
    "/login",
    loginLimiter,
    validateMiddleWare.validateInput(loginSchema),
    authMiddleWare.checkLoginRole(["User"]),
    controller.loginPost
);

router.post(
    "/register/request-otp",
    validateMiddleWare.validateInput(emailSchema),
    controller.registerOTP
);

router.post(
    "/register/verOtp",
    validateMiddleWare.validateInput(registerOtpVerifySchema),
    controller.verifyOtp
)

router.post(
    "/register/verify",
    validateMiddleWare.validateInput(registerVerifySchema),
    controller.registerVerify
);

router.post("/refresh", controller.refreshPost);

router.post(
    "/change-password",
    authMiddleWare.checkAccessToken(),
    validateMiddleWare.validateInput(changePassSchema),
    controller.changePassword
);

router.post(
    "/forgot-password",
    validateMiddleWare.validateInput(emailSchema),
    controller.forgotPassword
);

router.post(
    "/reset-password/:token",
    validateMiddleWare.validateInput(newPassSchema),
    controller.resetPassword
);

router.post(
    "/logout",
    authMiddleWare.checkAccessToken(),
    controller.logoutPost
);

module.exports = router;
