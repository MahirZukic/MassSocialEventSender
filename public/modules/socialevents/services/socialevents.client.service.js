'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('socialevents').factory('SocialEvents', ['$resource',
	function($resource) {
		return $resource('socialevents/:socialeventId', {
            socialeventId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);