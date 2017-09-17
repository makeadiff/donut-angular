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
	vm.selected_manager = 0;
	vm.city_managers = {};
	vm.manager = "Coach";
	if(User.isPOC()) vm.manager = "Finance Fellow";

	if(User.checkLoggedIn()) {
		var fundraiser_id = User.getUserId();

		$http({
			method: 'GET',
			url: $rootScope.base_url + "donation/undeposited/" + fundraiser_id,
			transformRequest: $rootScope.transformRequest,
		}).success(function (data) {
			vm.is_processing = false;

			if(data.error) {
				var alert = $mdDialog.alert().title('Error!').content(data.error).ok('Ok');
				$mdDialog.show(alert);
				$location.path('/');
			} else {
				for (var i in data.donations) {
					vm.show_donation[i] = false;
					vm.include_donation[i] = false;
				}
				vm.donation_collection = {
					"donations": data.donations,
					"approved_donations": data.approved_donations
				}
				vm.donation_count = Object.keys(data.donations).length + Object.keys(data.approved_donations).length;
				vm.show_mode = "donation-list";
			}
		}).error(function (data) {
			vm.is_processing = false;

			var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
			$mdDialog.show(alert);
			$location.path('/');
		});

		var fetch_user_type = 'get_coaches_in_city';
		if(User.isPOC()) fetch_user_type = 'get_finace_fellow_in_city';
		$http({
			method: 'GET',
			url: $rootScope.base_url + "user/"+fetch_user_type+"/" + User.getUserCityId(),
			transformRequest: $rootScope.transformRequest,
		}).success(function (data) {
			vm.city_managers = data.users;
		});

	} else {
		vm.is_processing = false;

		var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
		$mdDialog.show(alert);
		$location.path('/login');
	};

	vm.addDeposit = function() {
		vm.is_processing = true;

		var donation_ids = [];
		var collected_from_user_id = User.getUserId();
		var given_to_user_id = vm.selected_manager;

		for(var donation_id in vm.include_donation) {
			if(vm.include_donation[donation_id]) donation_ids.push(donation_id);
		}

		$http({
			method: 'POST',
			url: $rootScope.base_url + "deposit/add",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			transformRequest: $rootScope.transformRequest,
			data: {"donation_ids": donation_ids, "collected_from_user_id": collected_from_user_id, "given_to_user_id": given_to_user_id}
		}).success(function (data) {
			vm.is_processing = false;
			if(data.error) {
				var alert = $mdDialog.alert().title('Error!').content(data.error).ok('Ok');
				$mdDialog.show(alert);
				$location.path('/deposit');
				return;
			}

			var alert = $mdDialog.alert().title('Success!').content('Deposit of ' + Object.keys(vm.include_donation).length + ' donations made to ' + vm.city_managers[vm.selected_manager].name).ok('Ok');
			$mdDialog.show(alert);
			$location.path('/');

		}).error(function (data) {
			vm.is_processing = false;

			var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
			$mdDialog.show(alert);
			$location.path('/');
		});
	}

	$rootScope.isObjectEmpty = function(card){
	   return Object.keys(card).length === 0;
	}
}]);
