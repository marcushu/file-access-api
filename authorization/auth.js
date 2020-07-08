//
//  Authorization strategy and middleware for 'passport'  
//  authorization.
//

const LocalStrategy = require('passport-local').Strategy
const useraccess = require('./useraccess.js');

module.exports = function (passport) {

  //  Passport authorization 'stragegy'
  //
  const authenticateUser = (user, password, done) => {
    useraccess.passWordCorrect(user, password).then(matched => {
      if (matched) {
        // OK, authorized 
        return done(null, user);
      } else {
        done(null, false);
      }
    });

  }

  //  Passport authorization middleware
  //
  const loggedIn = () => {
    return function (req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      }
      res.redirect('/unauthorized')
    }
  }

  // Set up passport
  passport.use('login-local', new LocalStrategy({ usernameField: 'user' }, authenticateUser));
  passport.loggedIn = loggedIn;

  // Handle serialization
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user);
  );

}

