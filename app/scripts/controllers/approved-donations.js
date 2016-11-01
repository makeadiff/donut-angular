'use strict';

/**
 * @ngdoc function
 * @name donutApp.controller:ApprovedDonationsCtrl
 * @description
 * # ApprovedDonationsCtrl
 * Controller of the donutApp
 */
angular.module('donutApp')
  .controller('ApprovedDonationsCtrl', ['$http','$scope','$rootScope','$mdDialog','UserService','$location', '$cookies',
  			function($http,$scope,$rootScope,$mdDialog,User, $location, $cookies){
		var vm = this;
		vm.is_processing = true;
		vm.error = "";
		vm.donations = {};
		vm.active_donation_id = 0;

		if(User.checkLoggedIn()) {
			var poc_id = User.getUserId();

			$http({
				method: 'GET',
				url: $rootScope.base_url + "donation/get_approved_donations/" + poc_id,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: function(obj) {
					var str = [];
					for(var p in obj) { str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p])); }
					return str.join('&');
				}
			}).success(function (data) {
				vm.is_processing = false;

				if(data.success) {
					vm.donations = data.donations;
				} else {
					vm.error = data.error;
				}

			}).error(function (data) {
				vm.is_processing = false;

				var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
				$mdDialog.show(alert);
				$location.path('/');
			});

		} else {
			vm.is_processing = false;

			var alert = $mdDialog.alert().title('Error!').content('Connection error. Please login again.').ok('Ok');
			$mdDialog.show(alert);
			$location.path('/login');

		};

		vm.transformRequest = function(obj) {
			var str = [];
			for(var p in obj) { str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p])); }
			return str.join('&');
		}

		vm.userCheck = function() {
			if(!User.checkLoggedIn()) {
				var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
				$mdDialog.show(alert);
				$location.path('/login');
				return false;
			}
			return true;
		}

		vm.rejectDonation = function(donation_id) {
			if(!vm.userCheck()) return false;
			vm.active_donation_id = donation_id;
			
			var confirm = $mdDialog.confirm().title('Reject Donation?')
				.content('Are you sure you want to reject the donation of Rs. ' + vm.donations[donation_id].amount + ' from ' + vm.donations[donation_id].user_name)
				.ok('Yes').cancel('No');
			$mdDialog.show(confirm).then(vm.rejectDonationCall, function() { // No
				
			});
		}

		vm.rejectDonationCall = function() {
			vm.is_processing = true;
			var donation_id = vm.active_donation_id;
			var poc_id = User.getUserId();

			$http({
				method: 'GET',
				url: $rootScope.base_url + "donation/" + donation_id + '/reject/' + poc_id,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: vm.transformRequest
			}).success(function (data) {
				vm.is_processing = false;
				vm.donations[data.donation_id].donation_status = 'TO_BE_APPROVED_BY_POC';
				vm.active_donation_id = 0;

				var alert = $mdDialog.alert().title('Success!').content('Donation Recjected. ID: ' + data.donation_id).ok('Ok');
				$mdDialog.show(alert);

			}).error(vm.connectionError);
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
				url: $rootScope.base_url + "donation/" + donation_id + '/delete/' + poc_id,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: vm.transformRequest
			}).success(function (data) {
				vm.is_processing = false;
				vm.donations[data.donation_id].donation_status = 'DELETED';
				vm.active_donation_id = 0;

				var alert = $mdDialog.alert().title('Success!').content('Donation Deleted. ID: ' + data.donation_id).ok('Ok');
				$mdDialog.show(alert);

			}).error(vm.connectionError);
		}


		vm.connectionError = function (data) {
			vm.is_processing = false;
			vm.active_donation_id = 0;

			var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
			$mdDialog.show(alert);
		}
  }]);

