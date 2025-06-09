const express = require("express");
const joi = require("joi");

const controller = require("../../controllers/admin/auth.controller");
//Middlewares
const authMiddleWare = require("../../middlewares/authenticate.middleware");
const validateMiddleWare = require("../../middlewares/validate.middleware");
const loginLimiter = require("../../limiters/loginLimiter");
const router = express.Router();
const { loginSchema } = require("../../schemas/admin/auth.schema");

router.post(
    "/login",
    loginLimiter,
    validateMiddleWare.validateInput(loginSchema),
    authMiddleWare.checkLoginRole(["Admin"]),
    controller.loginPost
);



module.exports = router;
