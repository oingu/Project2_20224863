const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const verfifyToken = promisify(jwt.verify);
module.exports.checkAccessToken = (role = "User") => {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res
                .status(401)
                .json({ message: "Access denied: no Authorization header" });
        }
        const isBearer = authHeader.startsWith("Bearer ");
        if (!isBearer) {
            return res
                .status(400)
                .json({ message: "Authorization header must be bearer" });
        }
        const token = authHeader.split(" ")[1];
        try {
            const decodedToken = await verfifyToken(
                token,
                process.env.ACCESS_SECRET,
            );
            if (decodedToken && decodedToken.userId) {
                req.userId = decodedToken.userId;
                req.email = decodedToken.email;
                if (role !== "User") {
                    req.role = decodedToken.role;
                    if (decodedToken.role !== role) {
                        return res.status(403).json({
                            message: `Access denied: ${role} required`,
                        });
                    }
                }
                return next();
            } else {
                return res
                    .status(403)
                    .json({ message: "Invalid token: userId missing" });
            }
        } catch (error) {
            if (error && error.name === "TokenExpiredError") {
                return res
                    .status(401)
                    .json({ message: "Access token expired" });
            }
            return res.status(403).json({ message: "Invalid token" });
        }
    };
};

module.exports.checkLoginRole = (roles = ["User"]) => {
    return async (req, res, next) => {
        const { email } = req.body;
        if (!email) {
            return res.status(401).json({ message: "Unauthorized: No email" });
        }
        try {
            const user = await User.findOne({
                email: email,
                deleted: false,
            }).populate("role");
            if (!user) {
                return res
                    .status(401)
                    .json({ message: "Unauthorized: Invalid credentials" });
            }
            if (roles.includes(user.role.title)) {
                req.userId = user._id;
                req.email = user.email;
                req.role = user.role.title;
                return next();
            } else {
                return res
                    .status(403)
                    .json({ message: "Forbidden: Insufficient permissions" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    };
};

module.exports.checkPermission = (requiredPermissions = []) => {
    return async (req, res, next) => {
        const roleTitle = req.role;
        if (!roleTitle) {
            return res
                .status(403)
                .json({ message: "Access denied: no role found" });
        }
        const role = await Role.findOne({ title: roleTitle });
        if (!role) {
            return res
                .status(403)
                .json({ message: "Access denied: role not found" });
        }
        const permissions = role.permissions || [];

        const hasPermission = requiredPermissions.some((permission) =>
            permissions.includes(permission)
        );
        if (!hasPermission) {
            return res
                .status(403)
                .json({ message: "Access denied: insufficient permission" });
        }
        return next();
    };
};
