'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * SocialEvent Schema
 */
var SocialEventSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	sent: {
		type: Date,
		default: null
	},
	providers: {
		type: Array,
		default: []
	},
	autosend: {
		type: Boolean,
		default: false
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('SocialEvent', SocialEventSchema);