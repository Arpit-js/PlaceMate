const express = require('express');
const router = express.Router();
const Application = require('../models/Application');



function ensureAuth(req,res,next){ if(!req.session.user) return res.redirect('/login'); next(); }


router.get('/dashboard', ensureAuth, async (req,res) => {
const userId = String(req.session.user.id);
const apps = await Application.find({ userId }).sort({ createdAt: -1 });
res.render('dashboard', { apps });
});



router.post('/api', ensureAuth, async (req,res) => {
const payload = req.body;
payload.userId = String(req.session.user.id);
const app = new Application(payload);
await app.save();
res.json({ ok: true, item: app });
});


router.put('/api/:id', ensureAuth, async (req,res) => {
const id = req.params.id;
const updated = await Application.findByIdAndUpdate(id, req.body, { new: true });
res.json({ ok: true, item: updated });
});


router.delete('/api/:id', ensureAuth, async (req,res) => {
await Application.findByIdAndDelete(req.params.id);
res.json({ ok: true });
});


module.exports = router;