const mongoose = require("mongoose");

const user_schema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Role", 
            required: true,
            default: new mongoose.Types.ObjectId("681b1c83f60d2db3126b0e25") // User
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date,
    },
    {
        strict: false,
        timestamps: true,
    }
);

const User = mongoose.model("User", user_schema, "users");

module.exports = User;


