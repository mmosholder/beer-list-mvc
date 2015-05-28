var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

// Express Session for cookies, and parse cookies
var session = require('express-session');
var cookieParser = require('cookie-parser');

// Flash to store one-time messages between views
var flash = require('connect-flash');

// load in base passport library
var passport = require('passport');

// Load in passport config
var passportConfig = require('./config/passport');


//Pull in Controllers
var indexController = require('./controllers/index.js');
var authenticationController = require('./controllers/authentication');
var apiController = require('./controllers/api');

// Connect to DB
mongoose.connect('mongodb://localhost/beer-project');


var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

// Add in cookierParser and flash middleware for use later
app.use(cookieParser());
app.use(flash());

// Initialize Express session
app.use(session ({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Hook in passport to the middleware chain
app.use(passport.initialize());

// Hook in the passport session mgmt to middleware chain
app.use(passport.session());

// Get request for viewing log-in modal
app.get('/auth/login', authenticationController.login);

// Post received from submitting the login form
app.post('/auth/login', authenticationController.processLogin);

// Post received from submitting the signup fomr
app.post('/auth/signup', authenticationController.processSignup);

// Any requests to log out are handled here
app.get('/auth/logout', authenticationController.logout);

// get request for index before ensureAuthenticated since all visitors can see index, not just logged in users
app.get('/', indexController.index);

app.get('/api/getTweets', apiController.twitterFeed);

app.get('/template/:templateName', indexController.templates);

app.get('/signup', indexController.signup);


// ***** IMPORTANT ***** //
// By including this middleware (defined in our config/passport.js module.exports),
// We can prevent unauthorized access to any route handler defined after this call
// to .use()
app.use(passportConfig.ensureAuthenticated);



var server = app.listen(9945, function() {
	console.log('Express server listening on port ' + server.address().port);
});
