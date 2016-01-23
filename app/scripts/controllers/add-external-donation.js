'use strict';

/**
 * @ngdoc function
 * @name donutApp.controller:AddExternalDonationCtrl
 * @description
 * # AddExternalDonationCtrl
 * Controller of the donutApp
 */
angular.module('donutApp')
  .controller('AddExternalDonationCtrl', ['$http','$mdDialog','UserService','$location', '$routeParams', '$filter', '$rootScope',function($http,$mdDialog,User,$location,$routeParams, $filter, $rootScope) {
		var vm = this; //vm stands for view-model

		//Initializing fields to be empty otherwise fields contain undefined.
		vm.donation = {};
		vm.donation.name = "";
		vm.donation.amount = "";
		vm.donation.email = "";
		vm.donation.phone = "";
		vm.donation.donation_type = $routeParams.donation_type;
		vm.donation.created_at = new Date();

		//Initializing errors
		vm.is_error = false;
		vm.phone_absent = false;
		vm.email_absent = false;
		vm.phone_invalid = false;
		vm.email_invalid = false;
		vm.amount_invalid = false;
		vm.is_processing = false;

		vm.fundraiser_id = User.getUserId();

		vm.validCheck = function() {
			if(vm.donationForm.$valid == false){
				return false;

			} else if(vm.donation.phone == "") {
				vm.phone_absent = true;
				return false;

			} else if(vm.donation.email == "") {
				vm.email_absent = true;
				return false;

			} else if(vm.donation.phone.length != 10 || (isNaN(vm.donation.phone))) {
				vm.phone_invalid = true;
				return false;

			} else if(!vm.donation.email.match(/^[\w\-\+\.]+\@[\w\-\.]+\.[\w]{2,5}$/)) {
				vm.email_invalid = true;
				return false;

			} else if(vm.donation.amount.length !=0 && (isNaN(vm.donation.amount))) {
				vm.phone_invalid = true;
				return false;

			} else { // No errors.
				vm.phone_absent = false;
				vm.email_absent = false;
				vm.phone_invalid = false;
				vm.email_invalid = false;
				vm.amount_invalid = false;

				return true;
			}
		}


		vm.addExDonation = function() {
			vm.is_processing = true;

			if(User.checkLoggedIn()) {
				var fundraiser_id = User.getUserId();

				$http({
					method: 'POST',
					url: $rootScope.base_url + 'donation/add',
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
					transformRequest: function(obj) {
						var str = [];
						for(var p in obj) { str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p])); }
						return str.join('&');
					},
					data: {amount : vm.donation.amount, donor_name : vm.donation.name, donor_email : vm.donation.email,
						donor_phone : vm.donation.phone, fundraiser_id : fundraiser_id, 
						created_at : $filter("date")(vm.donation.created_at, "yyyy-MM-dd"),
						donation_type : vm.donation.donation_type, format : 'json'}

				}).success(function (data) {
					vm.is_processing = false;

					var alert = $mdDialog.alert().title('Success!').content('Donation successfully added. ID: ' + data.donation.id).ok('Ok');
					$mdDialog.show(alert);

				}).error(function (data) {
					vm.is_processing = false;
					vm.is_error = true;

					var alert = $mdDialog.alert().title('Error!').content('Connection issue with \''+add_donation_url+'\'. Please try again later.').ok('Ok');
					$mdDialog.show(alert);
				});


			} else {
				vm.is_processing = false;
				vm.is_error = true;

				var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
				$mdDialog.show(alert);
				$location.path('/login');

			};

			//Initializing fields to be empty otherwise fields contain undefined.
			vm.donation = {};
			vm.donation.name = "";
			vm.donation.amount = "";
			vm.donation.email = "";
			vm.donation.phone = "";
			vm.donation.donation_type = "";
			vm.donation.created_at = "";
		};

  }]);