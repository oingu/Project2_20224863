//[GET] /dashboard
module.exports.index = async (req, res) => {
    res.render("./client/pages/dashboard/dashboard.pug");
}