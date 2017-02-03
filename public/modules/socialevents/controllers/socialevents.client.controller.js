'use strict';

angular.module('socialevents').controller('SocialEventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'SocialEvents',
	function($scope, $stateParams, $location, Authentication, SocialEvents) {
        // TODO: need to add lodash(_) module dependency to all client controllers
		$scope.authentication = Authentication;
		// TODO: fix the availableProviders, they don't work now
		$scope.availableProviders = [{name: 'facebook', enabled: false}, {name: 'twitter', enabled: false},
            {name: 'google', enabled: false}, {name: 'linkedin', enabled: false}, {name: 'meetup', enabled: false}];

		$scope.useFacebook = false || Authentication.user.autoFacebookEnabledByDefault;
		$scope.useTwitter = false || Authentication.user.autoTwitterEnabledByDefault;
		$scope.useGoogle = false || Authentication.user.autoGoogleEnabledByDefault;
        $scope.autosend = false || Authentication.user.autoAutoSendEnabledByDefault

        $scope.resetAvailableProvidersToUnused = function() {
            // $.each($scope.availableProviders, function (item) {
				// if (item.enabled) {
            //         item.enabled = false;
            //     }
            // });
			for (var index in $scope.availableProviders) {
                if ($scope.availableProviders[index].enabled) {
                    $scope.availableProviders[index].enabled = false;
                }
			}
            // forEach($scope.availableProviders, function (item) {
            //     if (item.enabled) {
            //         item.enabled = false;
            //     }
            // });
        }

        $scope.getOrResetAvailableProviders = function() {
			if ($scope.availableProviders && $scope.availableProviders.length == 0) {
                $scope.getProviders();
			}
            $scope.resetAvailableProvidersToUnused();
        }

		$scope.create = function() {
            // TODO: change this to use lodash
            var providers = [{name: 'facebook', value: $scope.useFacebook}, {
                name: 'twitter',
                value: $scope.useTwitter
            }, {name: 'google', value: $scope.useGoogle}].map(function (item) {
            	if (item.value) {
            		return item.name;
				}
            });
			var socialevent = new SocialEvents({
				title: this.title,
				// content: this.content,
				providers: providers,
                autosend: $scope.autosend,
                isSent: false,
                sent: null,
                bestTimeToSend: null
			});
            socialevent.$save(function(response) {
				$location.path('socialevents');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
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
            $scope.getOrResetAvailableProviders();
		};

		$scope.update = function() {
			var socialevent = $scope.socialevent;

            socialevent.$update(function() {
				$location.path('socialevents/' + socialevent._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
            $scope.getOrResetAvailableProviders();
		};

		$scope.find = function() {
			$scope.socialevents = SocialEvents.query();
            $scope.getOrResetAvailableProviders();
		};

		$scope.findOne = function() {
			$scope.socialevent = SocialEvents.get({
                socialeventId: $stateParams.socialeventId
			});
            $scope.getOrResetAvailableProviders();
		};

		$scope.send = function () {
            $scope.socialevent.bestTimeToSend = Date.now();
            $scope.socialevent.$save(function(response) {
                $location.path('socialevents/' + response._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

		$scope.getProviders = function() {
			$scope.availableProviders = [{name: 'facebook', enabled: false}, {name: 'twitter', enabled: false},
				{name: 'google', enabled: false}, {name: 'linkedin', enabled: false}, {name: 'meetup', enabled: false}];
		};
        $scope.availableProviders = $scope.getOrResetAvailableProviders();
	}
]);