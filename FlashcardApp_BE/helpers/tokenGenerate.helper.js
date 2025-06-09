const jwt = require("jsonwebtoken");
const systemConfig = require("../config/system");
const crypto = require("crypto");

module.exports.generateAccessToken = (user) => {
    return jwt.sign(
        {userId: user._id, role: user.role.title, email: user.email, jti: crypto.randomUUID()}, // hoặc crypto.randomBytes(16).toString("hex")}, 
        process.env.ACCESS_SECRET,
        {expiresIn: systemConfig.accessTokenExpiration.inString}
        // {expiresIn: 5}
    );
}

module.exports.generateRefreshToken = (user) => {
    return jwt.sign(
        {userId: user._id},
        process.env.REFRESH_SECRET,
        {expiresIn: systemConfig.refreshTokenExpiration.inString}
    )
}

