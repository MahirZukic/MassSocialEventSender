'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Talk = mongoose.model('Talk'),
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
				message = 'Talk already exists';
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
 * Create a Talk
 */
exports.create = function(req, res) {
	var talk = new Talk(req.body);
	talk.user = req.user;

	talk.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(talk);
		}
	});
};

/**
 * Show the current Talk
 */
exports.read = function(req, res) {
	res.jsonp(req.talk);
};

/**
 * Update a Talk
 */
exports.update = function(req, res) {
	var talk = req.talk ;

	talk = _.extend(talk , req.body);

	talk.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(talk);
		}
	});
};

/**
 * Delete an Talk
 */
exports.delete = function(req, res) {
	var talk = req.talk ;

	talk.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(talk);
		}
	});
};

/**
 * List of Talks
 */
exports.list = function(req, res) { Talk.find().sort('-created').populate('user', 'displayName').exec(function(err, talks) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(talks);
		}
	});
};

/**
 * Talk middleware
 */
exports.talkByID = function(req, res, next, id) { Talk.findById(id).populate('user', 'displayName').exec(function(err, talk) {
		if (err) return next(err);
		if (! talk) return next(new Error('Failed to load Talk ' + id));
		req.talk = talk ;
		next();
	});
};

/**
 * Talk authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.talk.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};