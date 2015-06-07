var newFeed = require('../models/twitterSearch.js');
var async = require('async');
var _ = require('underscore');

var myUnique = function (arr) {
    var check = {};
    var output = [];

    for(var i = 0; i < arr.length; i++) {
        if (!(check[arr[i].message])) {
            check[arr[i].message] = true;
            output.push(arr[i]);
        }
    }
};

var apiController = {
    // twitterFeed: function (req, res) {
    //     newFeed.newFeed(req.query.location, function (tweets) {
    //         res.send({tweets: tweets});
    //     });
    // },
    // fbFeed: function (req, res) {
    //     newFeed.fbItems(req.query.location, function (err, ids) {
    //         if (err) return console.log(err);
    //         // perform next level function on results before sending
    //         newFeed.fbPosts(ids, function (err, posts){
    //             if (err) return console.log(err);
    //             res.send({posts: posts});
    //         });
    //     });
    // },
    getFeeds: function (req, res) {
        async.parallel([
            // function (onComplete) {
            //     newFeed.newFeed(req.query.location, function (tweets) {
            //         onComplete(null, tweets);
            //     });
            // },
            function (onComplete) {
                // newFeed.fbItems(req.query.location, function (err, ids) {
                //     if (err) return console.log(err);
                //     // perform next level function on results before sending
                //     newFeed.fbPosts(ids, function (err, posts){
                //         if (err) return console.log(err);
                //         onComplete(null, posts);
                //     });
                // });
                async.parallel([
                    function (onComplete) {
                        newFeed.fbItems(req.query.location, 'beer', function (err, ids) {
                            if (err) return console.log(err);
                            // perform next level function on results before sending
                            newFeed.fbPosts(ids, function (err, posts){
                                if (err) return console.log(err);
                                onComplete(null, posts);
                            });
                        });
                    },
                    // function (onComplete) {
                    //     newFeed.fbItems(req.query.location, 'brewery', function (err, ids) {
                    //         if (err) return console.log(err);
                    //         // perform next level function on results before sending
                    //         newFeed.fbPosts(ids, function (err, posts){
                    //             if (err) return console.log(err);
                    //             onComplete(null, posts);
                    //         });
                    //     });
                    // } 
                    function (onComplete) {
                        newFeed.fbItems(req.query.location, 'brewing', function (err, ids) {
                            if (err) return onComplete(err);
                            // perform next level function on results before sending
                            newFeed.fbPosts(ids, function (err, posts){
                                if (err) return onComplete(err);
                                onComplete(null, posts);
                            });
                        });
                    }
                ], function (err, results) {
                    if (err) return console.log(err);
                    onComplete(err, _.flatten(results));
                });
            }
        ], function (err, results) {
            if (err) console.log(err);
            res.send(_.flatten(results));
        });
    }     
};

module.exports = apiController;
