const experss = require("express");

//Controller
const controller = require("../../controllers/admin/role.controller");
const router = experss.Router();
// Middleware
const authMiddleware = require("../../middlewares/authenticate.middleware");
const validateMiddleware = require("../../middlewares/validate.middleware");
const { roleSchema } = require("../../schemas/admin/role.schema");
router.get(
    "/",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["ACCESS_CONTROL_ADMIN"]),
    controller.getAllRoles
);

router.post(
    "/",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["ACCESS_CONTROL_ADMIN"]),
    validateMiddleware.validateInput(roleSchema),
    controller.createRole
);

router.get(
    "/permissions",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["ACCESS_CONTROL_ADMIN"]),
    controller.getAllPermissions
);

router.patch(
    "/permissions",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["ACCESS_CONTROL_ADMIN"]),
    controller.updateRolePermissions
);

router.get(
    "/:roleId",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["ACCESS_CONTROL_ADMIN"]),
    controller.getRole
);

router.delete(
    "/:roleId",
    authMiddleware.checkAccessToken("Admin"),
    authMiddleware.checkPermission(["ACCESS_CONTROL_ADMIN"]),
    controller.deleteRole
);
module.exports = router;
