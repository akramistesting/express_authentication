const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Server memory variables for user data
const users = [
  {
    id: 1,
    username: 'alice',
    passwordHash: '$2a$10$BQKlV6kXkI7Q4xLl/hTvPO7F5CY6sV5vfWjO5nAMjiO.QhXnqks2O', // Hashed password for "password123"
  },
  // Add more user objects as needed
];

module.exports = function (passport) {
  passport.use(
    'local-login',
    new LocalStrategy((username, password, done) => {
      const user = users.find((u) => u.username === username);

      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      if (!bcrypt.compareSync(password, user.passwordHash)) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    })
  );

  passport.use(
    'local-register',
    new LocalStrategy(
      {
        passReqToCallback: true, // Allows us to access req object in the callback
      },
      (req, username, password, done) => {
        // Check if the username is already taken
        if (users.some((user) => user.username === username)) {
          return done(null, false, { message: 'Username is already taken' });
        }

        // Hash the password before storing it
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create a new user object and add it to the users array (simulated server memory)
        const newUser = {
          id: users.length + 1, // You can generate unique IDs as needed
          username,
          passwordHash: hashedPassword,
        };

        users.push(newUser);

        return done(null, newUser);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    const user = users.find((u) => u.id === id);
    done(null, user);
  });
};
