require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const flash = require('connect-flash');
const methodOverride = require('method-override');

const connectMongoose = require('./config/mongoose');
const sequelize = require('./config/sequelize');
const User = require('./models/user.js');

const authRoutes = require('./routes/auth');
const appRoutes = require('./routes/apps');

const app = express();


connectMongoose().catch(console.error);
mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});


(async () => {
  try {
    await sequelize.authenticate();
    await User.sync();
    console.log('✅ Connected to SQLite');
  } catch (err) {
    console.error('❌ SQLite connection error:', err);
  }
})();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));


const store = new SequelizeStore({ db: sequelize });
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret123',
  resave: false,
  saveUninitialized: false,
  store
}));
store.sync();
app.use(flash());


app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.messages = req.flash();
  next();
});


app.use('/', authRoutes);
app.use('/apps', appRoutes);

app.get('/', (req, res) => {
  if (!req.session.user) return res.render('index');
  return res.redirect('/apps/dashboard');
});


const DEFAULT_PORT = process.env.PORT || 8080;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠ Port ${port} in use, trying next port...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
}

startServer(DEFAULT_PORT);
