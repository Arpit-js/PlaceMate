const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user");


router.get("/signup", (req, res) => res.render("signup", { isLogin: false }));


router.post("/signup", async (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !password) {
        req.flash("error", "Email and password required");
        return res.redirect("/signup");
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
        req.flash("error", "User exists");
        return res.redirect("/signup");
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, name, passwordHash: hash });
    req.session.user = { id: user.id, email: user.email, name: user.name };
    res.redirect("/apps/dashboard");
});


router.get("/login", (req, res) => res.render("signup", { isLogin: true }));


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
        req.flash("error", "Invalid credentials");
        return res.redirect("/login");
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
        req.flash("error", "Invalid credentials");
        return res.redirect("/login");
    }
    req.session.user = { id: user.id, email: user.email, name: user.name };
    res.redirect("/apps/dashboard");
});


router.post("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
