const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// Import Passport configuration
const passportConfig = require('./passport-config');

// Server memory variables for user data
const users = [
  {
    id: 1,
    username: 'alice',
    passwordHash: '$2a$10$BQKlV6kXkI7Q4xLl/hTvPO7F5CY6sV5vfWjO5nAMjiO.QhXnqks2O', // Hashed password for "password123"
  },
  // Add more user objects as needed
];

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: 'your_secret_key', resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passportConfig(passport);

// Routes
app.get('/', (req, res) => {
  res.render('login');
});

app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post(
  '/register',
  passport.authenticate('local-register', {
    successRedirect: '/dashboard',
    failureRedirect: '/register',
    failureFlash: true,
  })
);

app.post(
  '/login',
  passport.authenticate('local-login', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true,
  })
);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Middleware to check authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
