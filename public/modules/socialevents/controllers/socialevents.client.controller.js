'use strict';

angular.module('socialevents').controller('SocialEventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'SocialEvents',
	function($scope, $stateParams, $location, Authentication, SocialEvents) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			// TODO: change this to use the required fields for SocialEvent
			var socialevent = new SocialEvents({
				title: this.title,
				content: this.content,
				providers: this.providers
			});
            socialevent.$save(function(response) {
				$location.path('socialevents/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			this.title = '';
			this.content = '';
			this.providers = '';
		};

		$scope.remove = function(socialevent) {
			if (socialevent) {
                socialevent.$remove();

				for (var i in $scope.socialevents) {
					if ($scope.socialevents[i] === socialevent) {
						$scope.socialevents.splice(i, 1);
					}
				}
			} else {
				$scope.socialevent.$remove(function() {
					$location.path('socialevents');
				});
			}
		};

		$scope.update = function() {
			var socialevent = $scope.socialevent;

            socialevent.$update(function() {
				$location.path('socialevents/' + socialevent._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.socialevents = SocialEvents.query();
		};

		$scope.findOne = function() {
			$scope.socialevent = SocialEvents.get({
                socialeventId: $stateParams.socialeventId
			});
		};
	}
]);