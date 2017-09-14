'use strict';

/**
 * @ngdoc function
 * @name donutApp.controller:DepositCtrl
 * @description
 * # DepositCtrl
 * Controller of the donutApp
 */
angular.module('donutApp')
  .controller('DepositCtrl',['$http','$mdDialog','UserService','$location', '$rootScope', function ($http,$mdDialog,User,$location,$rootScope) {
	var vm = this;

	vm.is_processing = true;
	vm.donations = {};
	vm.show_donation = {};
	vm.include_donation = {};
	vm.show_mode = "donation-list";
	vm.selected_coach = 0;
	vm.city_coaches = {};

	if(User.checkLoggedIn()) {
		var fundraiser_id = User.getUserId();

		$http({
			method: 'GET',
			url: $rootScope.base_url + "donation/undeposited/" + fundraiser_id,
			transformRequest: $rootScope.transformRequest,
		}).success(function (data) {
			for (var i in data.donations) {
				vm.show_donation[i] = false;
				vm.include_donation[i] = false;
			}
			vm.donations = data.donations;
			vm.show_mode = "donation-list";
			vm.is_processing = false;

		}).error(function (data) {
			vm.is_processing = false;

			var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
			$mdDialog.show(alert);
			$location.path('/');
		});

		$http({
			method: 'GET',
			url: $rootScope.base_url + "user/get_coaches_in_city/" + User.getUserCityId(),
			transformRequest: $rootScope.transformRequest,
		}).success(function (data) {
			vm.city_coaches = data.coaches;
		});

	} else {
		vm.is_processing = false;

		var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
		$mdDialog.show(alert);
		$location.path('/login');
	};

	vm.addDeposit = function() {
		vm.is_processing = true;

		var donation_ids = Object.keys(vm.include_donation).join(",");
		var collected_from_user_id = User.getUserId();
		var given_to_user_id = vm.selected_coach;

		$http({
			method: 'POST',
			url: $rootScope.base_url + "deposit/add",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			transformRequest: $rootScope.transformRequest,
			data: {"donation_ids": donation_ids, "collected_from_user_id": collected_from_user_id, "given_to_user_id": given_to_user_id}
		}).success(function (data) {
			vm.is_processing = false;
			var alert = $mdDialog.alert().title('Success!').content('Deposit of ' + Object.keys(vm.include_donation).length + ' donations made to ' + vm.city_coaches[vm.selected_coach].name).ok('Ok');
			$mdDialog.show(alert);
			$location.path('/');

		}).error(function (data) {
			vm.is_processing = false;

			var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
			$mdDialog.show(alert);
			$location.path('/');
		});
	}
}]);
