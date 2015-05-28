var Twitter = require('twitter');
var _ = require('underscore');

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
    client.get('search/tweets', {q: 'beer', geocode: '40.015638,-105.270233,70mi', result_type: 'recent', count: '30'}, function(error, tweets, response){
        var newTweets = _.map(tweets.statuses, function (item) {
            return ({text: item.text, name: item.user.screen_name, profilePhoto: item.user.profile_image_url});
        });
        onComplete(newTweets);
    });
};
 

module.exports = newFeed;