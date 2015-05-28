var newFeed = require('../models/twitterSearch');

var indexController = {
	index: function(req, res) {
        res.render('index');
	}, 

    login: function (req, res) {
        res.render('login');
    },

    signup: function (req, res) {
        res.render('signup');
    },

    templates: function (req, res) {
        res.render('templates/' + req.params.templateName);
    }
};

module.exports = indexController;