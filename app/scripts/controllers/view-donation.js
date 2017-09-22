'use strict';

/**
 * @ngdoc function
 * @name donutApp.controller:ViewDonationCtrl
 * @description
 * # ViewDonationCtrl
 * Controller of the donutApp
 */
angular.module('donutApp')
  .controller('ViewDonationCtrl',['$http','$mdDialog','UserService','$location', '$rootScope', function ($http,$mdDialog,User,$location,$rootScope) {
		var vm = this;

		vm.is_processing = true;
		vm.donations = {};
		vm.error = false;

		if(User.checkLoggedIn()) {
			var fundraiser_id = User.getUserId();

			$http({
				method: 'GET',
				url: $rootScope.base_url + "donation/get_donations_by_user/" + fundraiser_id,
				transformRequest: $rootScope.transformRequest,
			}).success(function (data) {
				vm.is_processing = false;

				if(data.error) {
					vm.error = data.error
				} else {
					vm.donations = data.donations;
				}

			}).error(function (data) {
				vm.is_processing = false;

				var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
				$mdDialog.show(alert);
				$location.path('/');
			});

		} else {
			vm.is_processing = false;

			var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
			$mdDialog.show(alert);
			$location.path('/login');
		};
}]);
