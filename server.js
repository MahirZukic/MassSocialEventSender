'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
    AsyncPolling = require('async-polling');

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
	console.log("Async is fired: " + cnt++);

    // Then notify the polling when your job is done:
    end();
    // This will schedule the next call.
}, config.socialSendingInterval * 1000).run();

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);