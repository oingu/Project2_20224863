//Models
const Role = require("../../models/role.model");
const Permission = require("../../models/permission.model");
//[GET] /api/v1/admin/roles
module.exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find({ deleted: false }).select("-__v");
        return res.status(200).json({
            result: roles.length,
            data: roles,
        })
    } catch (error) {
        console.error('[GET /api/v1/admin/roles] Error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// [POST] /api/v1/admin/roles
module.exports.createRole = async (req, res) => {
    const { title, description = ""} = req.body;
    try {
        const isExist = await Role.findOne({ title: title, deleted: false });
        if (isExist) {
            return res.status(400).json({ message: "Role already exists" });
        }
        const newRole = new Role({
            title: title,
            description: description
        });
        await newRole.save();
        return res.status(201).json({
            message: "Create new role successfully",
            data: {
                title: title,
                description: description
            }
        });
    } catch (error) {
        console.error('[POST /api/v1/admin/roles] Error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// [DELETE] /api/v1/admin/roles/:roleId
module.exports.deleteRole = async (req, res) => {
    const { roleId } = req.params;
    try {
        const role = await Role.findOne({ _id: roleId, deleted: false });
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        role.deleted = true;
        role.deletedAt = new Date(Date.now());
        await role.save();
        return res.status(200).json({
            message: "Delete role successfully",
            data: {
                title: role.title,
                description: role.description
            }
        });
    } catch (error) {
        console.error(`[DELETE /api/v1/admin/roles/${roleId}] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// [GET] /api/v1/admin/roles/permissions
module.exports.getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find({ deleted: false });
        console.log(permissions);
        if (!permissions || permissions.length === 0) {
            return res.status(404).json({ message: "No permissions found" });
        }
        return res.status(200).json({
            result: permissions.length,
            data: permissions,
        });
    } catch (error) {
        console.error('[GET /api/v1/admin/roles/permissions] Error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// [GET] /api/v1/admin/roles/:roleId
module.exports.getRole = async (req, res) => {
    const { roleId } = req.params;
    try {
        const role = await Role.findOne({ _id: roleId, deleted: false });
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        return res.status(200).json({
            message: "Get role successfully",
            data: role,
        });
    } catch (error) {
        console.error(`[GET /api/v1/admin/roles/${roleId}] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// [PATCH] /api/v1/admin/roles/permissions
module.exports.updateRolePermissions = async (req, res) => {
    const {rolePermissions} = req.body;
    try {
        for (const role of rolePermissions) {
            const roleDoc = await Role.findOne({ _id: role._id, title: role.title, deleted: false });
            if (!roleDoc) {
                return res.status(404).json({ message: `Role with ID ${role.roleId} not found` });
            }
            roleDoc.permissions = role.permissions;
            await roleDoc.save();
        }
        return res.status(200).json({
            message: "Update role permissions successfully",
        });
    } catch (error) {
        console.error(`[PATCH /api/v1/admin/roles/permissions] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
}