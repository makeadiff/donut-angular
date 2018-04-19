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
	vm.active_donation_id = 0;

	if(User.checkLoggedIn()) {
		var fundraiser_id = User.getUserId();

		$http({
			method: 'GET',
			url: $rootScope.base_url + "users/" + fundraiser_id + '/donations',
			headers: $rootScope.request_headers,
			transformRequest: $rootScope.transformRequest,
		}).success(function (data) {
			vm.is_processing = false;

			if(data.status == 'error') {
				vm.error = data.message;
			} else {
				var donations = {};
				for(var i in data.data.donations) {
					var don = data.data.donations[i];
					donations[don.id] = don;
				}

				vm.donations = donations;
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
		}).then(function(response) {
			vm.is_processing = false;
			if(response.status >= 200 && response.status < 300) {
				vm.donations[donation_id].status = 'DELETED';
				vm.active_donation_id = 0;

				var alert = $mdDialog.alert().title('Success!').content('Donation Deleted. ID: ' + donation_id).ok('Ok');
				$mdDialog.show(alert);
			} else {
				var alert = $mdDialog.alert().title('Error').content(data.message).ok('Ok');
				$mdDialog.show(alert);
			}
		});
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
