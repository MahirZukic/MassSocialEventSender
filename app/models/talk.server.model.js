'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Talk Schema
 */
var TalkSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Talk name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill Talk description',
		trim: true
	},	
	presenter: {
		type: String,
		default: '',
		required: 'Please fill Talk presenter',
		trim: true
	},
	slidesUrl: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Talk', TalkSchema);