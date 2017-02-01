'use strict';

angular.module('events').controller('EventsController', ['$scope', '$http', 'Events',
	function($scope, $http, Events) {
		// Events controller logic
		// ...
        // $scope.title = 'High Performance WebSocket';
        // $scope.event2 = {
        //   'name': '"Developing Offline Applications" and "HTML 5 Animations"',      
        //   'time': 1411430400000,
        //   'event_url': 'http://www.meetup.com/HTML5-Denver-Users-Group/events/160326502/',
        //   'description': '<p><b>6 pm : "Developing Offline Applications with HTML 5" by Venkat Subramaniam</b></p>',
        //   'venue': {
        //     'name': 'Rally Software',
        //     'address_1': '1550 Wynkoop',
        //     'city': 'Denver',
        //     'state': 'CO',
        //   }
        // };

        // $scope.event = nextEvent;

        $scope.event = undefined;

        Events.getNextEvent().success(function(data){
          $scope.event = data;          
        });

        // var url = 'http://api.meetup.com/2/events?status=upcoming&order=time&limited_events=False&group_urlname=HTML5-Denver-Users-Group&desc=false&offset=0&photo-host=public&format=json&page=1&fields=&sig_id=13848777&sig=7aa5d53f450ee5449945e8ee89b8cba8968d9e30&callback=JSON_CALLBACK';
        // function returnFirstElement(data, headers) {
        //     return data.results[0];
        // }
        // var request = $http.jsonp(url, {transformResponse: returnFirstElement});
        // request.success(function(data, status, headers, config) {
        //     console.log('SUCCESS');
        //     console.log(data);
        //     $scope.event = data;
        // });
        // request.error(function(data, status, headers, config) {
        //     console.log('ERROR');
        //     console.log(data);
        // });

    }
]);