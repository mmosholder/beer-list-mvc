var passport = require('passport');

// local strategy
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// SERIALIZATION:
//  This small subset of code will take a user object, used
//  in our JS, and convert it into a small, unique, string
//  which is represented by the id, and store it into the
//  session.
passport.serializeUser(function(user, done){
  done(null, user.id);
});

// DESERIALIZATION:
//  Essentially the inverse of above. This will take a user
//  id out of the session and convert it into an actual
//  user object.
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});

// define strategy for local authentication. 
var localStrategy = new LocalStrategy (function (username, password, done) {
    User.findOne({username: username}, function (err, user) {
        if(err) return done(err);

        // if no user found with username, continue to next middleware
        if(!user) return done(null, false);

        // check if password given matches one in DB
        user.comparePassword(password, function (err, isMatch) {
            if(err) return done(err);

            if(isMatch) {
                return done(err, user);
            } else {
                return done(null, false);
            }
        });
    });
});

// hook in strategy to passport
passport.use(localStrategy);

// middleware allowing us to block access to routes if user isn't authenticated and redirect to login page.
module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }

        res.redirect('/auth/login');
    }
};