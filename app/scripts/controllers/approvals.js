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
		vm.deposits = {};
		vm.show_donations = {}
		vm.active_deposit_id = 0;
		vm.poc_or_fc = "poc"; // This keeps a track of what kind of volunteer the current user. poc / fc
		// Every Ajax call will be have this variable - to change the result depending on the current user.

		if(User.checkLoggedIn()) {
			var user_id = User.getUserId();
			if(User.isPOC()) vm.poc_or_fc = "poc";
			else vm.poc_or_fc = "fc";

			$http({
				method: 'GET',
				url: $rootScope.base_url + "deposit/for_review_by/" + user_id,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: $rootScope.transformRequest
			}).success(function (data) {
				vm.is_processing = false;

				if(data.success) vm.deposits = data.deposits;
				else vm.error = data.error;
			}).error(function() {
				vm.is_processing = false;
				return $rootScope.errorMessage();
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

		vm.approve = function(deposit_id) {
			vm.active_deposit_id = deposit_id;

			if(!vm.userCheck()) return false;

			var user_id = User.getUserId();

			// Show this only once per day
			if($cookies.get('daily_confirmation')) {
				vm.approveCall();
				return;
			}
			
			var confirm = $mdDialog.confirm().title('Collected?')
				.content('Please ensure that you have collected Rs. ' + vm.deposits[deposit_id].amount + ' from ' + vm.deposits[deposit_id].collected_from_user_name + '. Press \'Yes\' if already collected. Press \'No\' if not collected yet.')
				.ok('Yes').cancel('No');
			$mdDialog.show(confirm).then(function() { // Yes
				vm.is_processing = true;
				// No cookie - create cookie with one day expiry.
				var expire_date = new Date();
	  			expire_date.setDate(expire_date.getDate() + 1);
				$cookies.put('daily_confirmation', '1', {'expires': expire_date});

				vm.approveCall();
			});

		}

		vm.approveCall = function() {
			var deposit_id = vm.active_deposit_id;
			$http({
				method: 'GET',
				url: $rootScope.base_url + "deposit/" + deposit_id + '/approve/' + user_id,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: $rootScope.transformRequest
			}).success(function (data) {
				if(data.error) return vm.errorMessage("/approvals", data.error);

				vm.is_processing = false;
				vm.donations[data.deposit_id].donation_status = 'APPROVED';
				vm.active_deposit_id = 0;

				var from = vm.donations[data.deposit_id].collected_from_user_name;

				var alert = $mdDialog.alert().title('Success!').content('Donation of Rs '+vm.deposits[data.deposit_id].amount+' from \''+ from +'\' has been approved(ID: ' + data.deposit_id + ')').ok('Ok');
				$mdDialog.show(alert);

			}).error(vm.errorMessage);
		}


		// Delete donation option.
		vm.reject = function(deposit_id) {
			if(!vm.userCheck()) return false;
			vm.active_deposit_id = deposit_id;
			
			var confirm = $mdDialog.confirm().title('Delete Donation?')
				.content('Are you sure you want to delete the donation of Rs. ' + vm.deposits[deposit_id].amount + ' from ' + vm.deposits[deposit_id].user_name)
				.ok('Yes').cancel('No');
			$mdDialog.show(confirm).then(vm.rejectCall);
		}

		vm.rejectCall = function() {
			vm.is_processing = true;
			var deposit_id = vm.active_deposit_id;
			var user_id = User.getUserId();

			$http({
				method: 'GET',
				url: $rootScope.base_url + "donation/" + deposit_id + '/reject/' + user_id,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: $rootScope.transformRequest
			}).success(function (data) {
				if(data.error) return vm.errorMessage("/approvals", data.error);

				vm.is_processing = false;
				vm.deposits[data.deposit_id].donation_status = 'DELETED';
				vm.active_deposit_id = 0;

				var alert = $mdDialog.alert().title('Success!').content('Donation Deleted(ID: ' + data.deposit_id + ')').ok('Ok');
				$mdDialog.show(alert);

			}).error(vm.errorMessage);
		}
  }]);
