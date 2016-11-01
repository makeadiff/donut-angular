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
				url: $rootScope.base_url + "donation/get_donations_for_approval/" + poc_id,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: vm.transformRequest
			}).success(function (data) {
				vm.is_processing = false;

				if(data.success) vm.donations = data.donations;
				else vm.error = data.error;
				
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


		vm.approveDonation = function(donation_id) {
			vm.is_processing = true;
			vm.active_donation_id = donation_id;

			if(!User.checkLoggedIn()) {
				vm.is_processing = false;

				var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
				$mdDialog.show(alert);
				$location.path('/login');
				return;
			}

			var poc_id = User.getUserId();

			// Show this only once per day
			if($cookies.get('daily_confirmation')) {
				vm.approveDonationCall(); 
				return;
			}
			
			var confirm = $mdDialog.confirm().title('Collected?')
				.content('Please ensure that you have collected Rs. ' + vm.donations[donation_id].amount + ' from ' + vm.donations[donation_id].user_name + '. Press \'Yes\' if already collected. Press \'No\' if not collected yet.')
				.ok('Yes').cancel('No');
			$mdDialog.show(confirm).then(function() { // Yes
				// No cookie - create cookie with one day expiry.
				var expire_date = new Date();
	  			expire_date.setDate(expire_date.getDate() + 1);
				$cookies.put('daily_confirmation', '1', {'expires': expire_date});

				vm.approveDonationCall();
			}, function() { // No
				vm.is_processing = false;
			});

		}

		vm.approveDonationCall = function() {
			var donation_id = vm.active_donation_id;
			$http({
				method: 'GET',
				url: $rootScope.base_url + "donation/" + donation_id + '/approve/' + poc_id,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: vm.transformRequest
			}).success(function (data) {
				vm.is_processing = false;
				vm.donations[data.donation_id].donation_status = 'APPROVED';
				vm.active_donation_id = 0;

				var alert = $mdDialog.alert().title('Success!').content('Donation Approved. ID: ' + data.donation_id).ok('Ok');
				$mdDialog.show(alert);

			}).error(function (data) {
				vm.is_processing = false;
				vm.active_donation_id = 0;

				var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
				$mdDialog.show(alert);

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
  }]);
