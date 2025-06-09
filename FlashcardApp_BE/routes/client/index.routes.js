const systemConfig = require("../../config/system");
const loginRoute = require("./login.routes");
const authRoute = require("./auth.routes");
const flashcardRoute = require("./flashcard.routes");
const dashboardRoute = require("./dashboard.routes")
const userRoute = require("./user.routes");
const folderRoute = require("./folder.routes");
module.exports = (app) => {
    app.use("/login", loginRoute);
    app.use("/dashboard", dashboardRoute);
    app.use(`${systemConfig.apiPath}/v1/auth`, authRoute);
    app.use(`${systemConfig.apiPath}/v1/flashcards`, flashcardRoute);
    app.use(`${systemConfig.apiPath}/v1/user`, userRoute);
    app.use(`${systemConfig.apiPath}/v1/folders`, folderRoute);
}