'use strict';

//SocialEvents service used for communicating with the SocialEvents REST endpoints
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