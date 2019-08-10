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
		vm.national_account_user_id = 163416;  // National Finance User ID.
		vm.poc_or_fc = "poc"; // This keeps a track of what kind of volunteer the current user. poc / fc
		// Every Ajax call will be have this variable - to change the result depending on the current user.

		var user_id = User.getUserId();
		if(User.isPOC()) vm.poc_or_fc = "poc";
		else vm.poc_or_fc = "fc";

		$http({
			method: 'GET',
			url: $rootScope.base_url + "deposits?reviewer_user_id=" + user_id,
			headers: $rootScope.request_headers,
			transformRequest: $rootScope.transformRequest
		}).success(function (data) {
			vm.is_processing = false;

			if(data.status == 'success') vm.deposits = data.data.deposits;
			else vm.error = data.message;
		}).error(function() {
			vm.is_processing = false;
			return $rootScope.errorMessage();
		});

		vm.errorMessage = function (redirect_to, error_message) {
			vm.is_processing = false;
			return $rootScope.errorMessage(redirect_to, error_message);
		}

		vm.approve = function(deposit_id) {
			vm.active_deposit_id = deposit_id;
			var index = false;
			for(var i in vm.deposits) {
				if(vm.deposits[i].id == deposit_id) {
					index = i;
					break;
				}
			}
			if(index === false) return vm.errorMessage("/approvals", "Can't find the given deposit.");

			var user_id = User.getUserId();

			// Show this only once per day
			if($cookies.get('daily_confirmation')) {
				vm.approveCall();
				return;
			}
			
			var confirm = $mdDialog.confirm().title('Collected?')
				.content('Please ensure that you have collected Rs. ' + vm.deposits[index].amount + ' from ' + vm.deposits[index].collected_from_user_name + '. Press \'Yes\' if already collected. Press \'No\' if not collected yet.')
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
				method: 'POST',
				url: $rootScope.base_url + "deposits/" + deposit_id,
				headers: $rootScope.request_headers,
				transformRequest: $rootScope.transformRequest,
				data: { reviewer_user_id: user_id, status: 'approved' }
			}).success(function (response) {
				if(response.status == 'error') return vm.errorMessage("/approvals", data.message);

				var data = response.data;

				var index = false;
				for(var i in vm.deposits) {
					if(vm.deposits[i].id == deposit_id) {
						index = i;
						break;
					}
				}
				if(index === false) return vm.errorMessage("/approvals", "Can't find the given deposit.");

				vm.is_processing = false;
				vm.deposits[index].status = 'approved';
				vm.active_deposit_id = 0;

				var from = vm.deposits[index].collected_from_user_name;

				var alert = $mdDialog.alert().title('Success!').content('Deposit of Rs '+vm.deposits[index].amount+' from \''+ from +'\' has been approved(ID: ' + deposit_id + ')').ok('Ok');
				$mdDialog.show(alert);

			}).error(vm.errorMessage);
		}


		// Delete donation option.
		vm.reject = function(deposit_id) {
			vm.active_deposit_id = deposit_id;
			
			var index = false;
			for(var i in vm.deposits) {
				if(vm.deposits[i].id == deposit_id) {
					index = i;
					break;
				}
			}
			if(index === false) return vm.errorMessage("/approvals", "Can't find the given deposit.");
			
			var confirm = $mdDialog.confirm().title('Delete Deposit?')
				.content('Are you sure you want to delete the deposit of Rs. ' + vm.deposits[index].amount + ' from ' + vm.deposits[index].collected_from_user_name)
				.ok('Yes').cancel('No');
			$mdDialog.show(confirm).then(vm.rejectCall);
		}

		vm.rejectCall = function() {
			vm.is_processing = true;
			var deposit_id = vm.active_deposit_id;
			var user_id = User.getUserId();

			$http({
				method: 'POST',
				url: $rootScope.base_url + "deposits/" + deposit_id,
				data: { reviewer_user_id: user_id, status: 'rejected' },
				headers: $rootScope.request_headers,
				transformRequest: $rootScope.transformRequest
			}).success(function (response) {
				if(response.status == 'error') return vm.errorMessage("/approvals", response.message);

				var data = response.data;

				var index = false;
				for(var i in vm.deposits) {
					if(vm.deposits[i].id == deposit_id) {
						index = i;
						break;
					}
				}
				if(index === false) return vm.errorMessage("/approvals", "Can't find the given deposit.");

				vm.is_processing = false;
				vm.deposits[index].status = 'rejected';
				vm.active_deposit_id = 0;

				var alert = $mdDialog.alert().title('Success!').content('Deposit Deleted(ID: ' + deposit_id + ')').ok('Ok');
				$mdDialog.show(alert);

			}).error(vm.errorMessage);
		}

		$rootScope.count = function(card){
		   return Object.keys(card).length;
		}
  }]);
