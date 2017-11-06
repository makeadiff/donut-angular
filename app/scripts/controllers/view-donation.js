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
			url: $rootScope.base_url + "donation/get_donations_by_user/" + fundraiser_id,
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
			if(data.success) {
				vm.donations[data.donation_id].donation_status = 'DELETED';
				vm.active_donation_id = 0;

				var alert = $mdDialog.alert().title('Success!').content('Donation Deleted. ID: ' + data.donation_id).ok('Ok');
				$mdDialog.show(alert);
			} else {
				var alert = $mdDialog.alert().title('Error').content(data.error).ok('Ok');
				$mdDialog.show(alert);
			}

		}).error(vm.errorMessage);
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
