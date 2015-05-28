var newFeed = require('../models/twitterSearch.js');

var apiController = {
    twitterFeed: function (req, res) {
        newFeed(req.query.location, function (tweets) {
            res.send({tweets: tweets});
        });
    }      
};

module.exports = apiController;
