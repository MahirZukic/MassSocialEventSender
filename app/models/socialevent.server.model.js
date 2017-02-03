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
	isSent: {
		type: Boolean,
		default: false
	},
	bestTimeToSend: {
		type: Date,
		default: null
	},
	providers: {
		type: Array,
		default: [],
		required: 'You have to select at least one social network'
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
	// content: {
	// 	type: String,
	// 	default: '',
	// 	trim: true,
     //    required: 'Content cannot be blank'
	// },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});
SocialEventSchema.add({ isSent: 'Boolean' });
SocialEventSchema.index( {user : 1, created: 2 }, {unique:true, background:true, w:1} );

SocialEventSchema.pre('save', function (next) {
    this.sent = null;
    this.sent = this.bestTimeToSend ? this.bestTimeToSend : null;
    this.isSent = false;
    next();
})

mongoose.model('SocialEvent', SocialEventSchema);