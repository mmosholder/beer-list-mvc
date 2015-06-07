var Twit = require('twit');
var _ = require('underscore');
var geocoder = require('simple-geocoder');
var ig = require('instagram-node').instagram();
var graph = require('fbgraph');
var async = require('async');

var keys;
if(process.env.API_KEY){
    keys = {
        consumer_key:  process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token_key: process.env.ACCESS_TOKEN_KEY,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET,
        graph_access_token: process.env.GRAPH_ACCESS_TOKEN,
        ig_client_id: process.env.IG_CLIENT_ID,
        ig_client_secret: process.env.IG_CLIENT_SECRET
    };
} else {
    var keys = require('../private.js');
}


var T = new Twit({
  consumer_key: keys.consumer_key,
  consumer_secret: keys.consumer_secret,
  access_token: keys.access_token_key,
  access_token_secret: keys.access_token_secret,
});

// Every call to `ig.use()` overrides the `client_id/client_secret`
// or `access_token` previously entered if they exist.
ig.use({ client_id: keys.ig_client_id,
         client_secret: keys.ig_client_secret });

ig.media_search(39.748767, -104.999994, {distance: 5000}, function(err, medias, remaining, limit) {
    var searchCaptions = _.map(medias, function (item) {
        return ({
            tags: item.tags, 
            postInfo: item.caption,
            // created_time: pluckCreatedAt,
            photoUrl: item.images
        });
    });
    var checkTags = _.map(searchCaptions, function (item){
        var tags = item.tags;
        var captions = item.caption;
        for(var i = 0; i < tags.length; i++) {
            if (tags[i] === 'beer' || tags[i] === 'craftbeer' || tags[i] === 'brewery') {
                console.log(tags[i]);
            }
        }
    });

});

graph.setAccessToken(keys.graph_access_token);


var fbIds = function (location, query, onComplete) {
    geocoder.geocode(location, function (success, locations) {
        if (success) console.log(success);
        var location = locations.y + ',' + locations.x;
                
        graph.search({q: query, type: 'place', center: location, distance: '5000', limit: 25}, function(err, res) {
            if (err) return onComplete(err);
            var itemArr = [];

            var searchResults = function (err, res) {
                if (err) return onComplete(err);
                // needs to save data, and check if 'next' exists
                itemArr = itemArr.concat(res.data);


                if(res.paging.next) {
                    graph.get(res.paging.next, searchResults);
                } else {
                    var idArr = _.map(itemArr, function (item) {
                        return ({id: item.id, name: item.name});
                    });
                    onComplete(null, idArr);
                }
            };
            searchResults(null, res);
        });
    });
};

var fbPosts = function (arr, onComplete) {
    async.parallel(
        arr.map(function (item) {
            var params = item.id + '?fields=posts.limit(5){message}';
            return function (onComplete) {
                graph.get(params, function (err, posts) {
                    if (err) return onComplete(err);
                    var newPosts = _.pluck(posts, 'data');
                    async.parallel(
                        _.chain(newPosts).compact().map(function (items) {
                            return items.map(function (newItem) {
                                var searchParams = newItem.id + '?fields=message,link,picture';
                                return function (onComplete) {
                                     graph.get(searchParams, function (err, messages) {
                                        onComplete(err, {name: item.name, message: messages.message, photoUrl: messages.picture, link: messages.link, created_time: newItem.created_time});
                                     });
                                };
                            });
                        }).flatten().value(), 
                        onComplete
                    );
                });
            };
        }), 
        function (err, results) {
            if (err) return console.log(err);
            var finalResults = _.flatten(results);
            onComplete(err, finalResults);
        }
    );
};

// fbIds('80004', function (err, ids) {
//     fbPosts(ids, function (err, posts) {
//         console.log(posts);
//     });
// });

var newFeed = function (location, onComplete) {
    geocoder.geocode(location, function (success, locations) {
        var location = locations.y + ',' + locations.x + ',10mi';
        T.get('search/tweets', {
            q: '"new beer" OR "now brewing" OR "just tapped" OR "on tap" OR "craft beer" OR "tap room" OR "beer tasting" -Untappd', 
            geocode: location, 
            since: '603547097942523900',
            result_type: 'recent',
            count: 40
        }, function(error, tweets, response){
            if(error) {
                return console.log('No results found');
            } else {
                var newTweets = _.map(tweets.statuses, function (err, item) {
                    if (err) return console.log(err);
                    var parseTwitterDate = function (text) {
                        return new Date(Date.parse(text.replace(/( +)/, ' UTC$1')));
                    };
                    var twitterUrl = function (str) {
                        var exp = /https?:(.*)$/;
                        return exp.exec(str)[0];
                    };

                    return ({message: item.text, 
                            name: item.user.screen_name, 
                            created_time: parseTwitterDate(item.created_at),
                            photoUrl: item.user.profile_image_url,
                            link: twitterUrl(item.text)
                        });
                });
                onComplete(newTweets);
            }
        });
    });
};


module.exports = {
    newFeed: newFeed,
    fbItems: fbIds,
    fbPosts: fbPosts
};