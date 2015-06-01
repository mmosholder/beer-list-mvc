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

// Instagram.set('client_id', '1cafdff61691495b9dd4bada3a632fb8');
// Instagram.set('client_secret', '7cb425c5de864fd386157d00c6440456');

// Instagram.media.search({ lat: 39.727646, lng: -104.978364, radius: 2 }, function (err, results) {
//     _.mapObject(results, function (item) {
//         console.log(item.tags);
//     });
// });


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
var tempArr = [ '664336970267447',
  '812884302128614',
  '456826637744688',
  '648088811907693',
  '108522995838678',
  '903747199690074',
  '163657470329111',
  '244557235559933',
  '122762945301',
  '121599011184103',
  '29328243280',
  '194134343972747',
  '65369839606',
  '1410136072540723',
  '311175085620387',
  '333953550083819',
  '389580281103276',
  '305105296227231',
  '249629245146716',
  '166236386843129',
  '418945814818065',
  '540396426095938',
  '115418858481050',
  '324959077608458',
  '374699879241803',
  '226650704123922',
  '192179307584157',
  '234143733369314',
  '435621476481753',
  '399696610085099',
  '237687729624109',
  '170790099616701',
  '389919111156739',
  '226544004042297' ];

var fbPosts = function (arr, onComplete) {
    _.map(arr, function (item) {
        var params = item + '?fields=posts.limit(10){message}';
        
        graph.get(params, function (err, posts) {
            if (err) onComplete(err);
            var newPosts = _.pluck(posts, 'data');
            var messages = function (err, posts) {
                if (err) return onComplete(err);
                var postIdArr = _.map(posts, function (item) {
                    var itemMap = _.map(item, function (newItem) {
                        var searchParams = newItem.id + '?fields=message,link,picture';
                        graph.get(searchParams, function (err, messages) {
                            return ({message: messages.message, photoUrl: messages.picture, link: messages.link});
                        });
                    });
                    onComplete(itemMap);
                });
                onComplete(null, postIdArr);
            };
            messages(null, newPosts);
        });
    });
};

fbPosts(tempArr, function (err, results) {
    // console.log(results);
});

var newFeed = function (location, onComplete) {
    geocoder.geocode(location, function (success, locations) {
        var location = locations.y + ',' + locations.x + ',20mi';
        client.get('search/tweets', {
            q: 'beer', 
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
    fbItems: fbIds,
    fbPosts: fbPosts
};