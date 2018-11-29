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
	vm.historical_donations = {};
	vm.error = false;
	vm.active_donation_id = 0;
	vm.donation_sum = 0;
	vm.donation_overall_sum = 0;
	vm.show_historical_donations = 0;

	vm.showError = function (error_message) {
		vm.is_processing = false;

		if(typeof error_message.message != 'undefined') error_message = error_message.message;
		else if(error_message.data.length) error_message = error_message.data.join("<br />");
		else if(!error_message) error_message = 'Connection error. Please try again later.';

		var alert = $mdDialog.alert().title('Error!').content(error_message).ok('Ok');
		$mdDialog.show(alert);
		// $location.path('/');
	}

	if(User.checkLoggedIn()) {
		var fundraiser_id = User.getUserId();

		$http({
			method: 'GET',
			url: $rootScope.base_url + "users/" + fundraiser_id + '/donations?from=2014-04-01',
			headers: $rootScope.request_headers,
			transformRequest: $rootScope.transformRequest,
		}).success(function (data) {
			vm.is_processing = false;

			if(data.status == 'error') {
				vm.error = data.message;
			} else {
				var this_year_donations = {};
				var all_donations = {};

				for(var i in data.data.donations) {
					var don = data.data.donations[i];

					var don_date = new Date(don.added_on);
					if((don_date.getFullYear() == $rootScope.year && don_date.getMonth() > 4)
							|| (don_date.getFullYear() == $rootScope.year + 1 && don_date.getMonth() >= 1 && don_date.getMonth() < 4)) {
						this_year_donations[don.id] = don;
						vm.donation_sum += Number(don.amount);
					} else {
						all_donations[don.id] = don;
					}
					vm.donation_overall_sum += Number(don.amount);
				}

				vm.donations = this_year_donations;
				vm.historical_donations = all_donations;
			}
		}).error(vm.showError);

	} else {
		vm.is_processing = false;

		var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
		$mdDialog.show(alert);
		$location.path('/login');
	};


	// Delete donation option.
	vm.deleteDonation = function(donation_id) {
		if(!vm.userCheck()) return false;
		vm.active_donation_id = donation_id;
		
		var confirm = $mdDialog.confirm().title('Delete Donation?')
			.content('Are you sure you want to delete the donation of Rs. ' + vm.donations[donation_id].amount + ' from ' + vm.donations[donation_id].fundraiser )
			.ok('Yes').cancel('No');
		$mdDialog.show(confirm).then(vm.deleteDonationCall);
	}

	vm.deleteDonationCall = function() {
		vm.is_processing = true;
		var donation_id = vm.active_donation_id;
		var poc_id = User.getUserId();

		$http({
			method: 'DELETE',
			url: $rootScope.base_url + "donations/" + donation_id,
			headers: $rootScope.request_headers,
			transformRequest: $rootScope.transformRequest
		}).success(function(response) {
			vm.is_processing = false;

			vm.donations[donation_id].status = 'DELETED';
			vm.active_donation_id = 0;

			var alert = $mdDialog.alert().title('Success!').content('Donation Deleted. ID: ' + donation_id).ok('Ok');
			$mdDialog.show(alert);
		}).error(vm.showError);
	}

	vm.userCheck = function() {
		if(!User.checkLoggedIn()) return vm.errorMessage("/login", "Please login to use this feature.");
		return true;
	}
	vm.errorMessage = function (redirect_to, error_message) {
		vm.is_processing = false;
		return $rootScope.errorMessage(redirect_to, error_message);
	}

}]);
