'use strict';

// Setting up route
angular.module('socialevents').config(['$stateProvider',
	function($stateProvider) {
		// SocialEvents state routing
		$stateProvider.
		state('listSocialEvents', {
			url: '/socialevents',
			templateUrl: 'modules/socialevents/views/list-socialevents.client.view.html'
		}).
		state('createSocialEvent', {
			url: '/socialevents/create',
			templateUrl: 'modules/socialevents/views/create-socialevent.client.view.html'
		}).
		state('viewSocialEvent', {
			url: '/socialevents/:socialeventId',
			templateUrl: 'modules/socialevents/views/view-socialevent.client.view.html'
		}).
		state('editSocialEvent', {
			url: '/socialevents/:socialeventId/edit',
			templateUrl: 'modules/socialevents/views/edit-socialevent.client.view.html'
		});
	}
]);