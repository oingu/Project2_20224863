const mongoose = require("mongoose");
const passwordResetToken_schema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        token: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true
    }
);
const PasswordResetToken = mongoose.model("PasswordResetToken",passwordResetToken_schema, "passwordResetTokens");
module.exports = PasswordResetToken;