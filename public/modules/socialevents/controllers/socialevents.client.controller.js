'use strict';

angular.module('socialevents').controller('SocialEventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'SocialEvents',
	function($scope, $stateParams, $location, Authentication, SocialEvents) {
        // TODO: need to add lodash(_) module dependency to all client controllers
		$scope.authentication = Authentication;
		// TODO: fix the availableProviders, they don't work now
		$scope.availableProviders = [{name: 'facebook', enabled: false}, {name: 'twitter', enabled: false},
            {name: 'google', enabled: false}, {name: 'linkedin', enabled: false}, {name: 'meetup', enabled: false}];

		$scope.useFacebook = false || Authentication.user && Authentication.user.autoFacebookEnabledByDefault;
		$scope.useTwitter = false || Authentication.user && Authentication.user.autoTwitterEnabledByDefault;
		$scope.useGoogle = false || Authentication.user && Authentication.user.autoGoogleEnabledByDefault;
        $scope.autosend = false || Authentication.user && Authentication.user.autoSendEnabledByDefault

        // TODO: dodati client side validaciju za ovo

        $scope.resetAvailableProvidersToUnused = function() {
			for (var index in $scope.availableProviders) {
                if ($scope.availableProviders[index].enabled) {
                    $scope.availableProviders[index].enabled = false;
                }
			}
        }

        $scope.getOrResetAvailableProviders = function() {
			if ($scope.availableProviders && $scope.availableProviders.length == 0) {
                $scope.getProviders();
			}
            $scope.resetAvailableProvidersToUnused();
        }

        function getTimeZone() {
        	// we have to multiply by -1 to get a real time zone, as currently browsers return -60 for +1 timezone
			return new Date().getTimezoneOffset() * -1 / 60;
        }

        $scope.create = function() {
            // TODO: change this to use lodash
            var providers = $scope.getProviders();
            var timezone = getTimeZone();
			var socialevent = new SocialEvents({
				title: this.title,
				providers: providers,
                autosend: $scope.autosend,
                isSent: false,
                sent: null,
                bestTimeToSend: null,
                timeZone: timezone
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
            var providers = $scope.getProviders();
			var socialevent = $scope.socialevent;
			socialevent.providers = providers;
            socialevent.timeZone = getTimeZone();

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
            $scope.socialevent.$promise.then(function (callback, errback, progressback) {
                $scope.useFacebook = callback.providers && callback.providers.indexOf("facebook") != -1;
                $scope.useTwitter = callback.providers && callback.providers.indexOf("twitter") != -1;
                $scope.useGoogle = callback.providers && callback.providers.indexOf("google") != -1;
                $scope.autosend = callback.autosend;
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
            var providers = [{name: 'facebook', value: $scope.useFacebook}, {
                name: 'twitter',
                value: $scope.useTwitter
            }, {name: 'google', value: $scope.useGoogle}].map(function (item) {
                if (item.value) {
                    return item.name;
                }
            }).filter(function (item) {
				return item;
            });
            return providers;
		};
        $scope.availableProviders = $scope.getOrResetAvailableProviders();
	}
]);