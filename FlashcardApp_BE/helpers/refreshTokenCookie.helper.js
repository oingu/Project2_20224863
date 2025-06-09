const systemConfig = require("../config/system");
module.exports.setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        signed: true,
        secure: process.env.NODE_ENV === "production", // bật khi dùng HTTPS
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // hoặc "Lax"
        maxAge:
            systemConfig.refreshTokenExpiration.inNumber * 24 * 60 * 60 * 1000,
    });
};
