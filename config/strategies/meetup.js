'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	url = require('url'),
	MeetupStrategy = require('passport-meetup').Strategy,
	config = require('../config'),
	users = require('../../app/controllers/users');

module.exports = function() {
	// Use meetup strategy
	passport.use(new MeetupStrategy({
	    consumerKey: config.meetup.clientKey,
	    consumerSecret: config.meetup.clientSecret,
	    callbackURL: config.meetup.callbackURL,
	    },
		function(req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

		    // Create the user OAuth profile
		    var providerUserProfile = {
		        firstName: '',
		        lastName: '',
		        displayName: profile.displayName,
		        email: '',
		        username: profile.id,
		        provider: profile.provider,
		        providerIdentifierField: 'id',
		        providerData: providerData
		    };

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
};