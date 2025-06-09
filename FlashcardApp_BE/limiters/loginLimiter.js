const rareLimit = require("express-rate-limit");
const TIME_LIMIT = 1; //Minute
const REQUEST_LIMIT = 5;

const loginLimiter = rareLimit({
    windowMs: TIME_LIMIT * 60 * 1000,
    max: REQUEST_LIMIT,
    message: "Too many login attempts, please try again later",
});

module.exports = loginLimiter;
