'use strict';

/**
 * @ngdoc function
 * @name donutApp.controller:ApprovalsCtrl
 * @description
 * # ApprovalsCtrl
 * Controller of the donutApp
 */
angular.module('donutApp')
  .controller('ApprovalsCtrl', ['$http','$scope','$rootScope','$mdDialog','UserService','$location', '$cookies',
  			function($http,$scope,$rootScope,$mdDialog,User, $location, $cookies) {
		var vm = this;
		vm.is_processing = true;
		vm.error = "";
		vm.donations = {};
		vm.subordinates = {};
		vm.active_donation_id = 0;
		vm.poc_or_fc = "poc"; // This keeps a track of what kind of volunteer the current user. poc / fc
		// Every Ajax call will be have this variable - to change the result depending on the current user.

		if(User.checkLoggedIn()) {
			var user_id = User.getUserId();
			if(User.isPOC()) vm.poc_or_fc = "poc";
			else vm.poc_or_fc = "fc";

			$http({
				method: 'GET',
				url: $rootScope.base_url + "donation/get_donations_for_"+vm.poc_or_fc+"_approval/" + user_id,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: $rootScope.transformRequest
			}).success(function (data) {
				vm.is_processing = false;

				if(data.success) vm.donations = data.donations;
				else vm.error = data.error;
			}).error(function() {
				vm.is_processing = false;
				return $rootScope.errorMessage();
			});

			$http({
				method: 'GET',
				url: $rootScope.base_url + "user/get_subordinates/" + user_id,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: $rootScope.transformRequest
			}).success(function (data) {
				if(data.success) {
					var subs = [];
					for (var key in data.subordinates) {
						subs[subs.length] = data.subordinates[key];
					}
					vm.subordinates = subs;
				}
			});

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

		vm.approveDonation = function(donation_id) {
			vm.active_donation_id = donation_id;

			if(!vm.userCheck()) return false;

			var user_id = User.getUserId();

			// Show this only once per day
			if($cookies.get('daily_confirmation')) {
				vm.approveDonationCall();
				return;
			}

			var message = '';
			if(vm.poc_or_fc == 'fc') message = 'Please ensure that you have deposited Rs. ' + vm.donations[donation_id].amount + ' from ' + vm.donations[donation_id].poc_name + '. Press \'Yes\' if already deposited. Press \'No\' if not depsoited yet.';
			else message = 'Please ensure that you have collected Rs. ' + vm.donations[donation_id].amount + ' from ' + vm.donations[donation_id].user_name + '. Press \'Yes\' if already collected. Press \'No\' if not collected yet.';
			
			var confirm = $mdDialog.confirm().title('Collected?')
				.content(message)
				.ok('Yes').cancel('No');
			$mdDialog.show(confirm).then(function() { // Yes
				vm.is_processing = true;
				// No cookie - create cookie with one day expiry.
				var expire_date = new Date();
	  			expire_date.setDate(expire_date.getDate() + 1);
				$cookies.put('daily_confirmation', '1', {'expires': expire_date});

				vm.approveDonationCall();
			});

		}

		vm.approveDonationCall = function() {
			var donation_id = vm.active_donation_id;
			$http({
				method: 'GET',
				url: $rootScope.base_url + "donation/" + donation_id + '/'+vm.poc_or_fc+'_approve/' + user_id,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: $rootScope.transformRequest
			}).success(function (data) {
				if(data.error) return vm.errorMessage("/approvals", data.error);

				vm.is_processing = false;
				vm.donations[data.donation_id].donation_status = 'DONE';
				vm.active_donation_id = 0;
			}).error(vm.errorMessage);
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
			var user_id = User.getUserId();

			$http({
				method: 'GET',
				url: $rootScope.base_url + "donation/" + donation_id + '/delete/' + user_id + '/' + vm.poc_or_fc,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: $rootScope.transformRequest
			}).success(function (data) {
				if(data.error) return vm.errorMessage("/approvals", data.error);

				vm.is_processing = false;
				vm.donations[data.donation_id].donation_status = 'DELETED';
				vm.active_donation_id = 0;

				var alert = $mdDialog.alert().title('Success!').content('Donation Deleted(ID: ' + data.donation_id + ')').ok('Ok');
				$mdDialog.show(alert);

			}).error(vm.errorMessage);
		}
  }]);
