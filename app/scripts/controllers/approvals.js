'use strict';

/**
 * @ngdoc function
 * @name donutApp.controller:ApprovalsCtrl
 * @description
 * # ApprovalsCtrl
 * Controller of the donutApp
 */
angular.module('donutApp')
  .controller('ApprovalsCtrl', ['$http','$scope','$rootScope','$mdDialog','UserService','$location',function($http,$scope,$rootScope,$mdDialog,User, $location){
		var vm = this;
		vm.is_processing = true;
		vm.error = "";
		vm.donations = {};

		if(User.checkLoggedIn()) {
			var poc_id = User.getUserId();

			$http({
				method: 'GET',
				url: $rootScope.base_url + "donation/get_donations_for_approval/" + poc_id,
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

		vm.approveDonation = function(donation_id) {
			vm.is_processing = true;

			if(!User.checkLoggedIn()) {
				vm.is_processing = false;

				var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
				$mdDialog.show(alert);
				$location.path('/login');
				return;
			}

			var poc_id = User.getUserId();

			$http({
				method: 'GET',
				url: $rootScope.base_url + "donation/" + donation_id + '/approve/' + poc_id,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: function(obj) {
					var str = [];
					for(var p in obj) { str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p])); }
					return str.join('&');
				}
			}).success(function (data) {
				vm.is_processing = false;
				vm.donations[903].donation_status = 'APPROVED';

				var alert = $mdDialog.alert().title('Success!').content('Donation Approved. ID: ' + data.donation_id).ok('Ok');
				$mdDialog.show(alert);

			}).error(function (data) {
				vm.is_processing = false;

				var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
				$mdDialog.show(alert);

			});
		}
  }])
	.filter('dateToISO', function() {
		return function(input) {
			var t = input.split(/[- :]/); // Split timestamp into [ Y, M, D, h, m, s ]
			var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]); // Apply each element to the Date function
			return d.toISOString();
		};
	});