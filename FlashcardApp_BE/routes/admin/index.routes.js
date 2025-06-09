const systemConfig = require("../../config/system");
const userRoute = require("./user.routes");
const authRoute = require("./auth.routes");
const postRoute = require("./post.routes");
const roleRoute = require("./role.routes");
module.exports = (app) => {
    app.use(`${systemConfig.apiPath}/v1/${systemConfig.prefixAdmin}/auth`, authRoute);
    app.use(`${systemConfig.apiPath}/v1/${systemConfig.prefixAdmin}/users`, userRoute);
    app.use(`${systemConfig.apiPath}/v1/${systemConfig.prefixAdmin}/posts`, postRoute);
    app.use(`${systemConfig.apiPath}/v1/${systemConfig.prefixAdmin}/roles`, roleRoute);
}