const bcrypt = require("bcryptjs");
const systemConfig = require("../../config/system");
//Models
const User = require("../../models/user.model");
const Session = require("../../models/session.model");

// Helpers
const tokenGenerate = require("../../helpers/tokenGenerate.helper");
const cookieHelper = require("../../helpers/refreshTokenCookie.helper");

//[POST] /api/v1/admin/auth/login
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;
    let find = {
        deleted: false,
        email: email,
    };
    try {
        const user = await User.findOne(find).populate("role");
        if (!user)
            return res.status(401).json({ message: "Invalid email or password" });
        if(user.role.title == "User"){
            return res.status(403).json({message: "Access denied: Moderator only"})
        }
        if (user.status && user.status !== "active") {
            return res.status(403).json({ message: "Account is not active" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword)
            return res
                .status(401)
                .json({ message: "Invalid password" });

        const accessToken = tokenGenerate.generateAccessToken(user);
        const refreshToken = tokenGenerate.generateRefreshToken(user);

        let sessions = await Session.find({
            userId: user._id,
            isRevoked: false,
        }).sort({ createdAt: 1 });
        if (sessions.length >= systemConfig.maxSessions) {
            const oldestSession = sessions[0];
            (oldestSession.isRevoked = true), await oldestSession.save();
        }
        const sessionDate = new Date(
            Date.now() +
                systemConfig.refreshTokenExpiration.inNumber *
                    24 *
                    60 *
                    60 *
                    1000
        );
        let session = new Session({
            userId: user._id,
            refreshToken,
            userAgent: req.headers["user-agent"],
            ipAddress: req.ip,
            expiresAt: sessionDate,
        });

        await session.save();

        cookieHelper.setRefreshTokenCookie(res, refreshToken);
        console.log(`${new Date(Date.now())} --- [ADMIN] ${email} logged in `);
        res.json({ accessToken: accessToken, role: user.role.title });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}