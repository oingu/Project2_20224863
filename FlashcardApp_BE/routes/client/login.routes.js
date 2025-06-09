const express = require("express");
const loginController = require("../../controllers/client/login.controller");

const router = express.Router();

router.get("/", loginController.index);


module.exports = router;
