const mongoose = require("mongoose");

const session_schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    refreshToken: String,
    userAgent: String,
    ipAddress: String,
    isRevoked: {
        type: Boolean,
        default: false
    },  
    expiresAt: Date,
},
    {
        timestamps: true
    }

);

const Session = mongoose.model("Session", session_schema, "sessions");

module.exports = Session;