const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { check } = require('express-validator');
const csurf = require('csurf');


const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(csurf({ cookie: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index', { csrfToken: req.csrfToken() });
});

app.post('/login', [
  check('username').notEmpty().withMessage('Username is required').normalizeEmail(),
  check('password').notEmpty().isLength({min: 8, max: 15}).withMessage('Password is required').escape()
], (req, res) => {
  // Validate and authenticate the user
  // Implement appropriate validation and secure authentication mechanisms here
  // For simplicity, you can use a hardcoded username and password for demonstration purposes

  const { username, password } = req.body;

  if (username === 'admin' && password === 'password') {
    req.session.isAuthenticated = true;
    res.redirect('/dashboard');
  } else {
    res.redirect('/');
  }
});

app.get('/dashboard', (req, res) => {
  // Secure the dashboard route to only allow authenticated users
  if (req.session.isAuthenticated && req.session.isAuthorized) {
    res.render('/views/dashboard');
  } else {
    res.redirect('/');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
