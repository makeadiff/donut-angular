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

	// Initilizations
	vm.is_processing = true;
	vm.error = "";
	vm.donations = {};
	vm.show_donation = {};
	vm.include_donation = {};
	vm.show_mode = "donation-list";
	vm.selected_manager = 0;
	vm.national_account_user_id = 13257; // Pooja's User ID in Donut
	vm.city_managers = {};
	vm.manager = "Coach";
	vm.add_deposit_button_text = "Handover to Coach";
	vm.donation_collection = {
		"donations": [],
		"approved_donations": [],
	};
	vm.donation_count = 0;
	
	if(User.isFC()) {
		vm.manager = "National Finance";
		vm.add_deposit_button_text = 'Mark as Deposited in Bank';
	} else if(User.isPOC()) {
		vm.manager = "Finance Fellow";
		vm.add_deposit_button_text = "Handover to Finance Fellow";
	}

	// Happen at the beginning - called from the end of the file.
	vm.init = function() {
		var fundraiser_id = User.getUserId();

		vm.is_processing = true;
		$http({
			method: 'GET',
			url: $rootScope.base_url + "donations?fundraiser_user_id=" + fundraiser_id + "&deposited=false",
			transformRequest: $rootScope.transformRequest,
			headers: $rootScope.request_headers,
		}).success(function(response) { vm.listDonations(response, 'donations'); }).error(vm.showError);

		$http({
			method: 'GET',
			url: $rootScope.base_url + "donations?approver_user_id=" + fundraiser_id + "&deposited=false",
			transformRequest: $rootScope.transformRequest,
			headers: $rootScope.request_headers,
		}).success(function(response) { vm.listDonations(response, 'approved_donations'); }).error(vm.showError);

		var coach_group_id = 369; // This is actually the FR volunteer user group - change as need be.
		var finance_fellow_group_id = 15;

		var group_id = coach_group_id; // If its any volunteer, find coaches in the city
		if(User.isPOC()) {
			group_id = finance_fellow_group_id; // If its a coach, find the finance fellow in the city.
			vm.manager = 'Finance Fellow';
		}

		$http({
			method: 'GET',
			url: $rootScope.base_url + "users?city_id=" + User.getUserCityId() + "&group_id=" + group_id,
			transformRequest: $rootScope.transformRequest,
			headers: $rootScope.request_headers
		}).success(function (data) {
			vm.city_managers = data.data.users;
			if(Object.keys(vm.city_managers).length == 1) {
				vm.selected_manager = vm.city_managers[0]['id'];
			}
		});
	}

	vm.listDonations = function (response, type) {
		vm.is_processing = false;
		
		if(response.status == 'error')  {
			vm.error = response.message;
			return false;
		}

		var data = response.data;

		for (var i in data.donations) {
			vm.show_donation[i] = false;
			vm.include_donation[i] = false;
		}
		vm.donation_collection[type] = data.donations,

		vm.donation_count += Object.keys(data.donations).length;
		vm.show_mode = "donation-list";
	}

	vm.addDeposit = function() {
		vm.is_processing = true;

		var donation_ids = [];
		var collected_from_user_id = User.getUserId();
		var given_to_user_id = vm.selected_manager;
		var given_to_user_name = "";

		for(var donation_id in vm.include_donation) {
			if(vm.include_donation[donation_id]) donation_ids.push(donation_id);
		}

		if(User.isFC()) { // Finance fellow is an FC - making deposits directly to the national account.
			given_to_user_id = vm.national_account_user_id;
			given_to_user_name = "National Account";
		} else {
			for(var i in vm.city_managers) {
				if(vm.city_managers[i].id == vm.selected_manager) {
					given_to_user_name = vm.city_managers[i].name;
					break;
				}
			}
		}

		$http({
			method: 'POST',
			url: $rootScope.base_url + "deposits",
			headers: $rootScope.request_headers,
			transformRequest: $rootScope.transformRequest,
			data: {"donation_ids": donation_ids, "collected_from_user_id": collected_from_user_id, "given_to_user_id": given_to_user_id}
		}).success(function (data) {
			vm.is_processing = false;
			if(data.status == 'error') {
				var alert = $mdDialog.alert().title('Error!').content(data.message).ok('Ok');
				$mdDialog.show(alert);
				$location.path('/deposit');
				return;
			}

			var alert = $mdDialog.alert().title('Success!').content('Deposit of ' + donation_ids.length + ' donations made to ' + given_to_user_name).ok('Ok');
			$mdDialog.show(alert);
			$location.path('/');

		}).error(vm.showError);
	}

	vm.showError = function (error_message) {
		vm.is_processing = false;

		if(!error_message) error_message = 'Connection error. Please try again later.';

		var alert = $mdDialog.alert().title('Error!').content(error_message).ok('Ok');
		$mdDialog.show(alert);
		$location.path('/');
	}

	$rootScope.count = function(card){
	   	return Object.keys(card).length;
	}



	if(User.checkLoggedIn()) {
		vm.init();

	} else {
		vm.is_processing = false;

		var alert = $mdDialog.alert().title('Error!').content("Can't authenticate user. Please login again.").ok('Ok');
		$mdDialog.show(alert);
		$location.path('/login');
	};
}]);
