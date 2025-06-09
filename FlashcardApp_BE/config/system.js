const ADMIN_PATH = "admin";
const API_PATH = "/api";
const REFRESH_TOKEN_EXPIRATION = 7; // days
const ACCESS_TOKEN_EXPIRATION = 15; // minutes
const MAX_SESSIONS = 3;
const OTP_EXPIRATION = 5; // minutes
const OTP_VERIFIED_EXPIRATION = 5; // minutes
const OTP_RESEND_LIMIT = 1; // minutes
const PASSWORD_RESET_EXPIRATION = 15; // minutes
const CLIENT_URL = "http://localhost:5173";
const DISCORD_CHANNEL_ID = ["1377077006750974023"];
module.exports = {
    prefixAdmin: ADMIN_PATH,
    discordChannelId: DISCORD_CHANNEL_ID,
    refreshTokenExpiration: {
        inNumber: REFRESH_TOKEN_EXPIRATION,
        inString: `${REFRESH_TOKEN_EXPIRATION}d`
    },
    accessTokenExpiration: {
        inNumber: ACCESS_TOKEN_EXPIRATION,
        inString: `${ACCESS_TOKEN_EXPIRATION}m`
    },
    passwordResetExpiration: {
        inNumber: PASSWORD_RESET_EXPIRATION,
        inString: `${PASSWORD_RESET_EXPIRATION}m`
    },
    otpVerifiedExpiration: {
        inNumber: OTP_VERIFIED_EXPIRATION,
    },
    clientUrl: CLIENT_URL,
    maxSessions: MAX_SESSIONS,
    apiPath: API_PATH,
    otpExpiration: OTP_EXPIRATION,
    otpResendLimit: OTP_RESEND_LIMIT
};