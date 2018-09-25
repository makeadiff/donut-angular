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
	vm.deposit_information = "";
	vm.national_account_user_id = 163416; // National Finance User ID.
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

		var group_id = $rootScope.coach_group_id; // If its any volunteer, find coaches in the city
		var get_groups = "&group_in=" + $rootScope.coach_group_id + "," + $rootScope.finance_fellow_group_id;
		
		if(User.isPOC()) {
			group_id = $rootScope.finance_fellow_group_id; // If its a coach, find the finance fellow in the city.
			vm.manager = 'Finance Fellow';
			get_groups = "&group_id=" + group_id;
		}

		$http({
			method: 'GET',
			url: $rootScope.base_url + "users?city_id=" + User.getUserCityId() + get_groups,
			transformRequest: $rootScope.transformRequest,
			headers: $rootScope.request_headers
		}).success(function (response) {
			vm.city_managers = response.data.users;
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
			data: {"donation_ids": donation_ids, "collected_from_user_id": collected_from_user_id, "given_to_user_id": given_to_user_id, "deposit_information": vm.deposit_information }
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

	vm.selectManager = function () {
		var count = 0;
		for(var donation_id in vm.include_donation) {
			if(vm.include_donation[donation_id]) count++;
		}

		if(count) vm.show_mode = 'manager-list';
		else {
			var alert = $mdDialog.alert().title('Error!').content('Please select the donations you wish to include in this deposit...').ok('Ok');
			$mdDialog.show(alert);
		}
	}

	vm.showError = function (error_message) {
		vm.is_processing = false;

		if(typeof error_message.message != 'undefined') error_message = error_message.message;
		else if(error_message.data.length) error_message = error_message.data.join("<br />");
		else if(!error_message) error_message = 'Connection error. Please try again later.';

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
