'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
    socialevents = require('../../app/controllers/socialevents');

module.exports = function(app) {
	// Article Routes
	app.route('/socialevents')
		.get(socialevents.list)
		.post(users.requiresLogin, socialevents.create);

	app.route('/socialevents/:socialeventId')
		.get(socialevents.read)
		.put(users.requiresLogin, socialevents.hasAuthorization, socialevents.update)
		.delete(users.requiresLogin, socialevents.hasAuthorization, socialevents.delete);

	// Finish by binding the article middleware
	app.param('socialeventId', socialevents.socialeventByID);
};