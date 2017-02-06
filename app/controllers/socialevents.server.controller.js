'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    SocialEvent = mongoose.model('SocialEvent'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'SocialEvent already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

// this shifts the time for the given timezone (e.g. +2 would add 2 hours, -10 would reduce 10 hours)
var timeAccountedForTimezone = function(currentTime, timezone) {
	// a trick to get miliseconds from Date object
	return currentTime -0 + timezone * 3600 * 1000;
}
function getLocalTimeZone() {
    return new Date().getTimezoneOffset() * -1 / 60;
}
var calculateBestTimeToSend = function (socialevent, user) {
	var targetTimeZone = socialevent.timeZone;
    var localTimeZone = getLocalTimeZone();
	// target best time is 12h - 15h, 13h preferably
	// 13h - 15h for Facebook
	// 15h for Twitter
	// 12h - 13h for Google+
	var targetHours = 13;
	var bestTimeInLocalTimezone;
	var localServerTime = Date.now();
	var localTargetTime = new Date(timeAccountedForTimezone(localServerTime, targetTimeZone - localTimeZone));
	if (localTargetTime.getHours() > targetHours) {
		// set the sending time tomorrow for the target hour
        localTargetTime.setHours(targetHours);
        // we dont change the minutes but rather leave them at the minute mark the user has created the post
        // this is done to ensure some entropy and not have thousands of posts all on 13:00, but rather
        // distributed throughout 13:00 - 13:59
        bestTimeInLocalTimezone = timeAccountedForTimezone(localTargetTime, +24);
	} else {
        localTargetTime.setHours(targetHours);
        bestTimeInLocalTimezone = localTargetTime;
	}
	// now adjust the time for user timezone setting the appropriate time when the posts
	// will be sent on server for server local time
	var bestTime = timeAccountedForTimezone(bestTimeInLocalTimezone, localTimeZone - targetTimeZone);
	return  bestTime;
};
/**
 * Create a article
 */
exports.create = function(req, res) {
	var socialevent = new SocialEvent(req.body);
    socialevent.user = req.user;
    socialevent.isSent = null;
    socialevent.sent = null;
    if (socialevent.autosend) {
        socialevent.bestTimeToSend = calculateBestTimeToSend(socialevent, req.user);
    } else {
        socialevent.bestTimeToSend = Date.now();
	}

    socialevent.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(socialevent);
		}
	});
};

/**
 * Show the current SocialEvent
 */
exports.read = function(req, res) {
	res.jsonp(req.socialevent);
};

/**
 * Update a SocialEvent
 */
exports.update = function(req, res) {
	var socialevent = req.socialevent;

    socialevent = _.extend(socialevent, req.body);
    if (!socialevent.isSent) {
        if (socialevent.autosend) {
            socialevent.bestTimeToSend = calculateBestTimeToSend(socialevent, req.user);
        } else {
            socialevent.bestTimeToSend = Date.now();
        }
    }

    socialevent.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(socialevent);
		}
	});
};

/**
 * Delete an SocialEvent
 */
exports.delete = function(req, res) {
	var socialevent = req.socialevent;

    socialevent.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(socialevent);
		}
	});
};

/**
 * List of SocialEvents
 */
exports.list = function(req, res) {
    SocialEvent.find({user: {_id: req.user._id}}).limit(10).sort('-created').populate('user', 'displayName').exec(function (err, socialevents) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(socialevents);
		}
	});
};

/**
 * SocialEvent middleware
 */
exports.socialeventByID = function(req, res, next, id) {
    SocialEvent.findById(id).populate('user', 'displayName').exec(function(err, socialevent) {
		if (err) return next(err);
		if (!socialevent) return next(new Error('Failed to load article ' + id));
		req.socialevent = socialevent;
		next();
	});
};

/**
 * SocialEvent authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.socialevent.user.id !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};