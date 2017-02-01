'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    SocialEvent = mongoose.model('SocialEvent'),
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

/**
 * Create a article
 */
exports.create = function(req, res) {
	var socialevent = new SocialEvent(req.body);
    socialevent.user = req.user;

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
 * Show the current article
 */
exports.read = function(req, res) {
	res.jsonp(req.socialevent);
};

/**
 * Update a article
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
 * Delete an article
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
 * List of Articles
 */
exports.list = function(req, res) {
    SocialEvent.find().sort('-created').populate('user', 'displayName').exec(function(err, socialevents) {
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
 * Article middleware
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
 * Article authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.socialevent.user.id !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};