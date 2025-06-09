const User = require("../../models/user.model");
const UserInformation = require("../../models/userInformation.model");
const Session = require("../../models/session.model");
const PasswordResetToken = require("../../models/passwordResetToken.model");
// Helpers
const redisClient = require("../../config/redis");
const systemConfig = require("../../config/system");
const mailer = require("../../services/mailer.service");

const YEAR_MILISECONDS = 365 * 24 * 60 * 60 * 60 * 1000;
// [GET] /api/v1/user/settings
module.exports.setting = async (req, res) => {
    const userId = req.userId;
    try {
        const userInformationDoc = await UserInformation.findOne({
            userId: userId,
            deleted: false,
            status: "active",
        }).select("-deleted -__v -_id -userId -updatedAt");
        if (!userInformationDoc) {
            return res
                .status(404)
                .json({ message: "User information not found or inactive" });
        }
        const userInformation = userInformationDoc.toObject();
        const userCreateDate = new Date(userInformation.createdAt);
        const currentDate = new Date(Date.now());
        delete userInformation.createdAt;
        userInformation.accountAge = Math.floor(
            Math.abs(currentDate - userCreateDate) / YEAR_MILISECONDS
        );
        res.status(200).json(userInformation);
    } catch (error) {
        console.error(`[GET /api/v1/user/settings] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [PATCH] /api/v1/user/settings
module.exports.settingPatch = async (req, res) => {
    const userId = req.userId;
    try {
        const userInformationDoc = await UserInformation.findOne({
            userId: userId,
            deleted: false,
            status: "active",
        });

        if (!userInformationDoc) {
            return res
                .status(404)
                .json({ message: "User information not found or inactive" });
        }
        if (req.body.phone !== undefined) {
            userInformationDoc.phone = req.body.phone;
        }

        if (req.body.address !== undefined) {
            userInformationDoc.address = req.body.address;
        }

        if (req.body.fullName !== undefined) {
            userInformationDoc.fullName = req.body.fullName;
        }

        await userInformationDoc.save();
        return res
            .status(200)
            .json({ message: "Update user information successfully" });
    } catch (error) {
        console.error(`[PATCH /api/v1/user/settings] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [DELETE] /api/v1/user/settings
module.exports.settingDelete = async (req, res) => {
    const userId = req.userId;
    try {
        const userInformation = await UserInformation.findOne({
            userId: userId,
            deleted: false,
            status: "active",
        });
        if (!userInformation) {
            return res
                .status(404)
                .json({ message: "User information not found or inactive" });
        }
        const user = await User.findOne({
            _id: userId,
            deleted: false,
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.deleted = true;
        userInformation.deleted = true;
        await user.save();
        await userInformation.save();
        await Session.deleteMany({userId: userId});
        await PasswordResetToken.deleteMany({userId: userId});
        return res.status(200).json({
            message: "Delete user successfully",
            data: {
                userId: userId,
                email: user.email,
                fullName: userInformation.fullName,
                address: userInformation.address,
                status: userInformation.status,
            },
        });
    } catch (error) {
        console.error(`[DELETE /api/v1/user/settings] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// [POST] /api/v1/user/email-change/request
module.exports.changeEmailRequest = async (req, res) => {
    const userId = req.userId;
    const otpSender = mailer.sendOtpEmailChange;
    const user = await User.findOne({
        _id: userId,
        deleted: false,
    });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    try {
        const resendKey = `otp:limit:${user.email}`;
        const otpKey = `otp:code:${user.email}`;

        // Block spam get OTP
        const isLimited = await redisClient.get(resendKey);
        if (isLimited)
            return res
                .status(429)
                .json({ message: "Please wait before requesting another OTP" });

        // OTP in range 100000 - 999999
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        //Save OTP and limit into redis
        await redisClient.setEx(otpKey, systemConfig.otpExpiration * 60, otp);
        await redisClient.setEx(
            resendKey,
            systemConfig.otpResendLimit * 60,
            "1"
        );
        otpSender(user.email, otp)
            .then(() => {
                console.log(`Otp change email: ${otp} sent to ${user.email}`);
            })
            .catch((err) => {
                console.error("❌ Email send error:", err);
            });
        return res.json({ message: "OTP has been sent to your email" });
    } catch (error) {
        console.error(`[POST /api/v1/user/email-change/request] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [POST] /api/v1/user/email-change/verify
module.exports.changeEmailVerify = async (req, res) => {
    const otp = req.body.otp;
    const email = req.email;
    try {
        const storedOtp = await redisClient.get(`otp:code:${email}`);
        if (!storedOtp || storedOtp != otp) {
            return res.status(401).json({ message: "Invalid or expired OTP" });
        }

        const verifyKey = `email:verify:${email}`;
        await redisClient.setEx(
            verifyKey,
            systemConfig.otpVerifiedExpiration.inNumber * 60,
            "1"
        );
        res.status(200).json({ message: "Verify email successfully" });
    } catch (error) {
        console.error(`[POST /api/v1/user/email-change/verify] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [PATCH] /api/v1/user/email-change
module.exports.changeEmail = async (req, res) => {
    const userId = req.userId;
    const email = req.email;
    const newEmail = req.body.newEmail;
    try {
        const existing = await User.findOne({ email: newEmail });
        if (existing) {
            return res.status(409).json({ message: "Email already in use" });
        }
        const verifyKey = `email:verify:${email}`;
        const isVerified = await redisClient.get(verifyKey);
        if (!isVerified) {
            return res.status(401).json({ message: "Otp is not verified" });
        }
        const user = await User.findOne({
            _id: userId,
            deleted: false,
        });
        const userInformation = await UserInformation.findOne({
            userId: userId,
            deleted: false,
            status: "active",
        });
        if (!user || !userInformation) {
            return res
                .status(404)
                .json({ message: "User or user information not found" });
        }
        user.email = newEmail;
        userInformation.email = newEmail;
        await user.save();
        await userInformation.save();
        await redisClient.del(verifyKey);
        return res.status(200).json({ message: "Change email successfully" });
    } catch (error) {
        console.error(`[PATCH /api/v1/user/email-change] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


