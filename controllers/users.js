const User = require("../models/user.js");


module.exports.renderNewSignUpForm = (req, res) => {
    return res.render("./Users/new.ejs");
};

module.exports.createSignUp = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            return res.redirect("/listings");
        });
             

    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("/signup");
    }
};


module.exports.renderNewLoginForm = (req, res) => {
    return res.render("./Users/login.ejs");
};
module.exports.login = (req, res) => {
    const redirectUrl = "/listings";
    req.flash("success", "Welcome to WanderLust you are signed in");
    return res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You are logged out now");
        return res.redirect("/listings");
    });
};
