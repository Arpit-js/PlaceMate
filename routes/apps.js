const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

// Dashboard
router.get("/dashboard", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const apps = await Application.find({ userId: req.session.user.id });
  res.render("apps/dashboard", { apps });
});

// Add Application
router.post("/add", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const { company, role, package: pkg, drives, deadline, topics, status } = req.body;

  await Application.create({
    userId: req.session.user.id,
    company,
    role,
    package: pkg,
    drives,
    deadline,
    topics: topics ? topics.split(",").map(t => t.trim()) : [],
    status,
  });

  res.redirect("/apps/dashboard");
});

module.exports = router;
