'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
    AsyncPolling = require('async-polling'),
    SendingFunctions = require('./config/socialsendingfunctions');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db);

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;


var cnt = 1;
AsyncPolling(function (end) {
    // Do whatever you want.
    // console.log("Async is fired: " + cnt++);
    var SocialEvent = mongoose.model('SocialEvent');
    var sendingFunctions = {};
    var posts = SocialEvent.find({
        // bestTimeToSend: { $lt: new Date() },
        // isSent: false
    },'content user title providers' , function(err, posts) {
        if (!err) {
            if (posts) {
                // callback(possibleUsername);
				// foreach provider send the corresponding content
                posts.forEach(function (post) {
					// console.log(post._id);
                    if (!post.isSent && post.autosend && post.bestTimeToSend <= Date.now() && post.providers) {
                        post.providers.forEach(function (provider) {
                            if (config[provider] && config[provider].clientID && config[provider].clientSecret) {
                                sendingFunctions[provider](post);
                            }
                        });
                    }
                });
            } else {
                // return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            // callback(null);
        }
    }).sort('-created');
    // Then notify the polling when your job is done:
    end();
    // This will schedule the next call.
}, config.socialSendingInterval * 1000 * 1).run();

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);