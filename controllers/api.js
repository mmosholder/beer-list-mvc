var newFeed = require('../models/twitterSearch.js');

var apiController = {
    twitterFeed: function (req, res) {
        newFeed.newFeed(req.query.location, function (tweets) {
            res.send({tweets: tweets});
        });
    },
    fbFeed: function (req, res) {
        newFeed.fbIds(req.query.location, function (err, results){
            if (err) {
                console.log(err);
                return res.status(500);
            }
            // perform next level function on results before sending
            res.send({results: results});
        });
    }
    // fbPosts: function (req, res) {
    //     newFeed.fbPosts(req.query.location, function (err, posts) {
    //         if (err) {
    //             console.log(ere);
    //             return res.status(500);
    //         }
    //         res.send({posts: posts});
    //     });
    // }     
};

module.exports = apiController;
