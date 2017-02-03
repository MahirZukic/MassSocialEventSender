'use strict';

/**
 * Module dependencies.
 */
var request = require('request');

module.exports.facebook = function(post, callback, error) {
    // TODO: add facebook api for sending posts
	var userId = post.user._id;
	var facebookPostUrl = 'https://graph.facebook.com/' + userId + '/feed';
    request.post(
        facebookPostUrl,
        { json: { message: post.title, link: post.content } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(body);
            } else {
                error(error);
			}
        }
    );
};

module.exports.twitter = function(post, callback, error) {
    // TODO: add twitter api for sending posts
    var userId = post.user._id;
    var twitterPostUrl = 'https://api.twitter.com/1.1/statuses/update';
    request.post(
        twitterPostUrl,
        { json: { status: post.title, link: post.content } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(body);
            } else {
                error(error);
            }
        }
    );
};