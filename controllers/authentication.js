var passport = require('passport');

var User = require('../models/user');

// utility function for login procedure
var performLogin =  function (req, res, next, user) {

    req.login (user, function (err){
        if(err) return next(err);

        return res.redirect('/');
    });
};

// base authentication controller object
var authenticationController = {

    // route-handler for the /auth/login route. meant to be a page that only shows login forms
    login: function (req, res) {
        res.render('/partials/login', {
            error: req.flash('error')
        });
    },

    // post handler for incoming login attempts
    processLogin: function (req, res, next) {

        // passsport 'authenticate' returns a method, so store it in a variable and call it with proper arguments afterwards.
        // using local strategy defined and used in the config/passport.js file
        var authFunction = passport.authenticate('local', function (err, user, info) {
            if(err) return next(err);

            // if user was not logged in due to not being in db or a password mismatch, set a flash variable to show the error
            // which will be read and used in the 'login' handler above then redirect to that handler
            if(!user) {
                req.flash('error', 'Error logging in. Please try again.');
                return res.redirect('/auth/login');
            }

            // if we make it this far, the user has correctly authenticated with passport, so now we'll just log the user in
            performLogin(req, res, next, user);
        });

        // authentication method is created, now call it
        authFunction(req, res, next);
    },

    // different from login procedure, will allow new users to create an account. will throw duplication errors. if none are found,
    // the user is successfully added to the DB, it is safe to assume they're ready to log in, so that will happen as well
    processSignup: function (req, res, next) {
        // create a new instance of the user model with the data passed to this handler. by using param, can assume this route will work
        // regardless of how the data is sent (post, get).
        var user = new User ({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            location: req.body.location
        });

        // save to db
        user.save(function (err, user) {
            if (err) {
                var errorMessage = 'An error occured, please try again';

                if(err.code === 11000) {
                    errorMessage = 'This user already exists';
                }

                req.flash('error', errorMessage);
                return res.redirect('/auth/login');
            }

            // if we make it this far, ready for the user to log in
            performLogin(req, res, next, user);
        });
    },

    logout: function (req, res) {
        req.logout();

        res.redirect('/auth/login');
    }
};


module.exports = authenticationController;