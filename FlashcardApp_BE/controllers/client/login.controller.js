//[GET] /login
module.exports.index = async (req, res) => {
    res.render("./client/pages/authentication/login.pug");
}