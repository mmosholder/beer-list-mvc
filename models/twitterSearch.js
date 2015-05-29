var Twitter = require('twitter');
var _ = require('underscore');
var geocoder = require('simple-geocoder');
var Instagram = require('instagram-node-lib');
var graph = require('fbgraph');
var async = require('async');

var keys;
if(process.env.API_KEY){
    keys = {
        consumer_key:  process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token_key: process.env.ACCESS_TOKEN_KEY,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
    };
} else {
    var keys = require('../private.js');
}

var client = new Twitter({
  consumer_key: keys.consumer_key,
  consumer_secret: keys.consumer_secret,
  access_token_key: keys.access_token_key,
  access_token_secret: keys.access_token_secret
});

Instagram.set('client_id', '1cafdff61691495b9dd4bada3a632fb8');
Instagram.set('client_secret', '7cb425c5de864fd386157d00c6440456');

graph.setAccessToken('1006080399410781|_iwF0gK2imuX5hy_FjcpE_vdGrs');

var fbIds = function (location, onComplete) {
    geocoder.geocode(location, function (success, locations) {
        if (success) console.log(success);
        var location = locations.y + ',' + locations.x;
        graph.search({q: 'brewery', type: 'place', center: location, distance: '5000'}, function(err, res) {
            if (err) return onComplete(err);

            var itemArr = [];

            var searchResults = function (err, res) {
                if (err) return onComplete(err);
                // needs to save data, and check if 'next' exists
                itemArr = itemArr.concat(res.data);

                if(res.paging.next) {
                    graph.get(res.paging.next, searchResults);
                } else {
                    var idArr = _.pluck(itemArr, 'id');
                    onComplete(null, idArr);
                }
            };
            searchResults(null, res);
        });
    });
};

var fbPosts = function (arr, onComplete) {

};

var newFeed = function (location, onComplete) {
    geocoder.geocode(location, function (success, locations) {
        var location = locations.y + ',' + locations.x + ',20mi';
        // Instagram.media.search({ lat: 39.727646, lng: -104.978364, radius: 10 });
        client.get('search/tweets', {
            q: 'brew', 
            geocode: location, 
            result_type: 'recent'
        }, function(error, tweets, response){
            if(tweets.length) {
                console.log('No results found');
            } else {
                var newTweets = _.map(tweets.statuses, function (item) {
                    return ({text: item.text, name: item.user.screen_name, profilePhoto: item.user.profile_image_url});        
                });
                onComplete(newTweets);
            }
        });
    });
};
 

module.exports = {
    newFeed: newFeed,
    fbItems: fbIds
};