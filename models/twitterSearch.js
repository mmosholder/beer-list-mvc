var Twitter = require('twitter');
var _ = require('underscore');
var geocoder = require('simple-geocoder');


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

var newFeed = function (location, onComplete) {
    geocoder.geocode(location, function (success, locations) {
        var location = locations.y + ',' + locations.x + ',20mi';
        client.get('search/tweets', {
            q: 'beer OR brewery', 
            geocode: location, 
            result_type: 'recent'
        }, function(error, tweets, response){
            if(!tweets) {
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
 

module.exports = newFeed;