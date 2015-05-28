var newFeed = require('../models/twitterSearch');

var indexController = {
	index: function(req, res) {
		newFeed(null, function (tweets) {
            res.render('index', {tweets: tweets});
        })
	}, 

    login: function (req, res) {
        res.render('login');
    },

    signup: function (req, res) {
        res.render('signup');
    }
};

module.exports = indexController;