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
    var User = mongoose.model('User');
    var sendingFunctions = {};
    var posts = SocialEvent.find({
        // bestTimeToSend: { $lt: new Date() },
        // isSent: false
    },'content user title providers autosend isSent bestTimeToSend' , function(err, posts) {
        if (!err) {
            if (posts) {
				// foreach provider send the corresponding content
                posts.forEach(function (post) {
                    var user = User.findOne({ _id: post.user._id || post.user })
                        .exec().then(function (user) {
                        if (!post.isSent && post.autosend && post.bestTimeToSend <= Date.now() && post.providers) {
                            post.providers.forEach(function (provider) {
                                provider = provider.toLowerCase();
                                if (user.additionalProvidersData[provider] && config[provider] &&
                                    config[provider].clientID && config[provider].clientSecret) {
                                    // TODO: implement promises here and everywhere else
                                    SendingFunctions(provider)(post, user,
                                        function (response) {
                                            user.save();
                                            post.sent = Date.now();
                                            post.isSent = true;
                                            post.save();
                                        },
                                        function (response) {
                                            console.log(response);
                                        });
                                }
                            });
                        }
                    },function (error) {
                        console.log(error);
                    });
                });
            } else {
                // there are no new post to send using auto-schedule method
            }
        } else {
            // there was an error trying to connect to the database and retrieve data
            console.log(err);
        }
    }).sort('-created');
    // Then notify the polling when your job is done:
    end();
    // This will schedule the next call.
}, config.socialSendingInterval * 1000 * 4).run();

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);