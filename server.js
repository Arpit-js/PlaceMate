// server.js (relevant parts)
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./config/sqlite');
const User = require('./models/user');
const Application = require('./models/application');

const authRoutes = require('./routes/auth');       // your existing auth routes
const appsRoutes = require('./routes/apps');       // new routes

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret123',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.error = req.flash('error') || [];
  res.locals.success = req.flash('success') || [];
  res.locals.user = req.session.user || null;
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// associations
User.hasMany(Application, { foreignKey: 'userId' });
Application.belongsTo(User, { foreignKey: 'userId' });

// routes
app.use('/', authRoutes);
app.use('/apps', appsRoutes);

// sync DBs (safe for dev)
(async () => {
  try {
    await sequelize.sync();
    console.log('✅ SQLite DB synced');
  } catch (err) {
    console.error('DB sync error', err);
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
app.get("/", (req, res) => {
  res.render("index", { user: req.session.user });
});
