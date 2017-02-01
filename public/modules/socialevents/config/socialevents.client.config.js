'use strict';

// Configuring the SocialEvents module
angular.module('socialevents').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'SocialEvents', 'socialevents', 'dropdown', '/socialevents(/create)?');
		Menus.addSubMenuItem('topbar', 'socialevents', 'List SocialEvents', 'socialevents');
		Menus.addSubMenuItem('topbar', 'socialevents', 'New Socialevent', 'socialevents/create');
	}
]);