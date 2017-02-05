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

var calculateBestTimeToSend = function (socialevent, user) {
	// hard-code this for now
	var userToSend = User.find();
	return Date.now();
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
    SocialEvent.find({user: {_id: req.user._id}}).sort('-created').populate('user', 'displayName').exec(function (err, socialevents) {
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