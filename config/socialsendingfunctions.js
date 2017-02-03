'use strict';

/**
 * Module dependencies.
 */
var config = require('./config'),
    facebook = require('fb'),
    twitter = require('twitter');

module.exports.facebook = function(post, user, callback, error) {
	var accessToken;
    var expires;
    if (user.provider == 'facebook') {
        accessToken = user.providerData.accessToken;
        expires = user.providerData.expires;
    } else {
        accessToken = user.additionalProvidersData['facebook'].accessToken;
        expires = user.additionalProvidersData['facebook'].expires;
    }
    // TODO: figure out how this works
    FB.setAccessToken(accessToken);
    if (Date.now() >= expires) {
        // Extend expiry time of the access token
        FB.api('oauth/access_token', {
            client_id: config['facebook'].clientID,
            client_secret: config['facebook'].clientSecret,
            redirect_uri: config['facebook'].callbackURL,
            // grant_type: 'fb_exchange_token',
            fb_exchange_token: accessToken
            // code: 'code'
        }, function (response) {
            if(!response || response.error) {
                error(response.error);
            }

            var accessToken = res.access_token;
            var expires = res.expires ? res.expires : 0;
            // TODO: fix this when I get the details regarding the facebook login
            if (user.provider == 'facebook') {
                user.providerData.accessToken = accessToken;
                user.providerData.expires = expires;
            } else {
                user.additionalProvidersData['facebook'].accessToken = accessToken;
                user.additionalProvidersData['facebook'].expires = expires;
            }

            FB.api('me/feed', 'post', { message: post.title, link: post.content }, function (response) {
                if(!response || response.error) {
                    error(response.error);
                }
                callback(response);
            });
        });
    } else {
        // no need to extend the expire duration of the token
        FB.api('me/feed', 'post', { message: post.title, link: post.content }, function (response) {
            if(!response || response.error) {
                error(response.error);
            }
            callback(response);
        });
    }

};

module.exports.twitter = function(post, user, callback, errorCallback) {
    var consumerKey,
        consumerSecret,
        // TODO: figure out how to get this
        bearerToken = '';
    if (user.provider == 'twitter') {
        consumerKey = user.providerData.token;
        consumerSecret = user.providerData.tokenSecret;
    } else {
        consumerKey = user.additionalProvidersData['twitter'].token;
        consumerSecret = user.additionalProvidersData['twitter'].tokenSecret;
    }
    var client = new Twitter({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        bearer_token: bearerToken
    });
    client.post('statuses/update', { status: post.title }, function(error, tweet, response) {
        if(error) {
            errorCallback(error);
        }
        callback(response);
    });
};