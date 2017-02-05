'use strict';

angular.module('events').factory('Events', ['$http',
	function($http) {
		// Events service logic
		// ...

		// Public API
		return {
			getNextEvent: function() {
				var url = 'http://api.meetup.com/2/events?status=upcoming&order=time&limited_events=False&group_urlname=HTML5-Denver-Users-Group&desc=false&offset=0&photo-host=public&format=json&page=1&fields=&sig_id=13848777&sig=7aa5d53f450ee5449945e8ee89b8cba8968d9e30&callback=JSON_CALLBACK';
				var returnFirstElement = function (data, headers) {
                    return data.results[0];
                };

			 	var request = $http.jsonp(url, {transformResponse: returnFirstElement});
			 	request.success(function(data, status, headers, config) {
				    // console.log('SUCCESS');
				    // console.log(data);
				});
			 	request.error(function(data, status, headers, config) {
				    // console.log('ERROR');
				    // console.log(data);
				});

			 	return request;
			}
		};
	}
]);