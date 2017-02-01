'use strict';

module.exports = {
	db: 'mongodb://localhost/test-dev',
	app: {
		title: 'Mass Social Event Sender'
	},
    meetup: {
        clientKey: process.env.MEETUP_KEY || 'APP_ID',
        clientSecret: process.env.MEETUP_SECRET || 'APP_SECRET',
        callbackURL: 'http://mahirzukic2.ddns.net/auth/meetup/callback'
    },	
	facebook: {
		clientID: process.env.FACEBOOK_ID || '190510068095064',
		clientSecret: process.env.FACEBOOK_SECRET || '3e6a85abb03679b5642b3418ab7ac82b',
		callbackURL: 'http://mahirzukic2.ddns.net/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'NSwZlA4l7hTUHy2xg9GDGJuCn',
		clientSecret: process.env.TWITTER_SECRET || 'HptHqJXKuibGQt2oDOBFCnpxnl3vkkVKcMXxOJK1nqUrnlj3wy',
		callbackURL: 'http://mahirzukic2.ddns.net/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '845800732482-ighqinott2gv2649jac5sqb36ln4fqe1.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'gRlsjQDhw6FQB5K2QLF4i2wT',
		callbackURL: 'http://mahirzukic2.ddns.net/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: 'http://mahirzukic2.ddns.net/auth/linkedin/callback'
	},
	// every x minutes try to send the saved requests to social networks
	socialSendingInterval: 10
};