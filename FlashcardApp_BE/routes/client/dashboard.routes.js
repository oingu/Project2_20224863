const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/dashboard.controller")
// Dashboard Controller

// Dashboard routes
router.get('/', controller.index);

module.exports = router;
