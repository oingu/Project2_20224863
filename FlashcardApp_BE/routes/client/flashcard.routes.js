const express = require("express");
// Middleware
const santinizeQuery = require("../../middlewares/santinizeQuery.middleware");
const router = express.Router();
//Controller
const controller = require("../../controllers/client/flashcard.controller");
//Middleware
const validateMiddleWare = require("../../middlewares/validate.middleware");
const { searchSchema } = require("../../schemas/client/flashcard.schema");

router.get(
    "/search",
    validateMiddleWare.validateInput(searchSchema),
    santinizeQuery({ required: ["word"], option: "query" }),
    controller.search
);

module.exports = router;
