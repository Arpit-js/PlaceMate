const express = require("express");
const router = express.Router();

function isAuth(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

router.get("/", isAuth, (req, res) => {
  res.render("dashboard", { apps: [] });
});

module.exports = router;
