'use strict';

/**
 * @ngdoc function
 * @name donutApp.controller:FindApprove
 * @description
 * # FindApprove
 * Controller of the donutApp
 */
angular.module('donutApp')
  .controller('FindApprove', ['$http','$scope','$rootScope','$mdDialog','UserService','$location', '$cookies',
  			function($http,$scope,$rootScope,$mdDialog,User, $location, $cookies) {
	var vm = this;
	vm.is_processing = false;
	vm.error = "";
	vm.donations = {};
	vm.search = {
		"fundraiser_name": "",
		"donor_name": "",
		"amount": 0
	}

	if(User.checkLoggedIn()) {
		var user_id = User.getUserId();
		if(!User.isFC()) vm.error = "Only Finance Fellows can access the Find and Approve Page";

	} else {
		vm.errorMessage("/login", "Connection error. Please login once again.")
	};

	vm.userCheck = function() {
		if(!User.checkLoggedIn()) return vm.errorMessage("/login", "Please login to use this feature.");
		return true;
	}
	vm.errorMessage = function (redirect_to, error_message) {
		vm.is_processing = false;
		return $rootScope.errorMessage(redirect_to, error_message);
	}

	vm.search = function() {
		vm.is_processing = true;

		$http({
			method: 'POST',
			url: $rootScope.base_url + "donation/search_undeposited",
			params: {"fundraiser_name": vm.search.fundraiser_name, "amount": vm.search.amount, 
						"donor_name": vm.search.donor_name, "city_id": User.getUserCityId(), "not_fundraiser_id": User.getUserId()},
			transformRequest: $rootScope.transformRequest,
		}).success(function (data) {
			vm.is_processing = false;

			if(data.error) {
				vm.error = data.error
			} else {
				var donations = {};
				for(var i in data.donations) {
					var don = data.donations[i];
					donations[don.id] = don;
				}

				vm.donations = donations;
			}

		}).error(function (data) {
			vm.is_processing = false;
		});
	}


	// Delete donation option.
	vm.deleteDonation = function(donation_id) {
		if(!vm.userCheck()) return false;
		vm.active_donation_id = donation_id;
		
		var confirm = $mdDialog.confirm().title('Delete Donation?')
			.content('Are you sure you want to delete the donation of Rs. ' + vm.donations[donation_id].amount + ' from ' + vm.donations[donation_id].user_name)
			.ok('Yes').cancel('No');
		$mdDialog.show(confirm).then(vm.deleteDonationCall);
	}

	vm.deleteDonationCall = function() {
		vm.is_processing = true;
		var donation_id = vm.active_donation_id;
		var poc_id = User.getUserId();

		$http({
			method: 'GET',
			url: $rootScope.base_url + "donation/" + donation_id + '/delete/' + poc_id + '/self',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			transformRequest: $rootScope.transformRequest
		}).success(function (data) {
			vm.is_processing = false;
			vm.donations[data.donation_id].donation_status = 'DELETED';
			vm.active_donation_id = 0;

			var alert = $mdDialog.alert().title('Success!').content('Donation Deleted. ID: ' + data.donation_id).ok('Ok');
			$mdDialog.show(alert);

		}).error(vm.errorMessage);
	}

	vm.collect = function(donation_id, fundraiser_id) {
		if(!vm.userCheck()) return false;
		vm.active_donation_id = donation_id;
		
		var confirm = $mdDialog.confirm().title('Mark Donation as Collected?')
			.content('Mark this donation as collected by yourself?')
			.ok('Yes').cancel('No');
		$mdDialog.show(confirm).then(function() {
			vm.collectCall(donation_id, fundraiser_id);
		});
	}

	vm.collectCall = function(donation_id, fundraiser_id) {
		var user_id = User.getUserId();
		vm.is_processing = true;

		$http({
			method: 'POST',
			url: $rootScope.base_url + "deposit/add",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			transformRequest: $rootScope.transformRequest,
			data: {"donation_ids": [donation_id], "collected_from_user_id": fundraiser_id, "given_to_user_id": user_id}
		}).success(function (data) {
			if(data.success) {
				var deposit_id = data.deposit_id;

				$http({
					method: 'GET',
					url: $rootScope.base_url + "deposit/" + deposit_id + '/approve/' + user_id,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
					transformRequest: $rootScope.transformRequest
				}).success(function (data) {
					vm.is_processing = false;

					var alert = $mdDialog.alert().title('Donation Approved').content('The Donation has been approved.').ok('Ok');
					$mdDialog.show(alert);
					$location.path('/');
				});
			}

		}).error(function (data) {
			vm.is_processing = false;

			var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
			$mdDialog.show(alert);
			$location.path('/');
		});
	}
}]);
