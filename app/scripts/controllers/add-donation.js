'use strict';

/**
 * @ngdoc function
 * @name donutApp.controller:AddDonationCtrl
 * @description
 * # AddDonationCtrl
 * Controller of the donutApp
 */
angular.module('donutApp')
  .controller('AddDonationCtrl', ['$http','$mdDialog','UserService','$location', '$filter', '$rootScope',function ($http,$mdDialog,User,$location,$filter,$rootScope) {

		var vm = this; //vm stands for view-model

		//Initializing fields to be empty otherwise fields contain undefined.
		vm.donation = {};
		vm.donation.name = "";
		vm.donation.amount = "";
		vm.donation.email = "";
		vm.donation.phone = "";
		vm.donation.address = "";
		vm.donation.eighty_g = "false";

		//Initializing errors
		vm.phone_email_absent = false;
		vm.phone_invalid = false;
		vm.amount_invalid = false;
		vm.is_processing = false;


		var fundraiser_id = User.getUserId();

		vm.validCheck = function() {
			if(vm.donationForm.$valid == false){
				return false;
			} else if(parseInt(vm.donation.amount) > 200 && vm.donation.phone == "" && vm.donation.email == "") {
				vm.phone_email_absent = true;
				return false;
			} else if(vm.donation.phone.length !=0 && (isNaN(vm.donation.phone))) {
				vm.phone_invalid = true;
				return false;
			} else if(vm.donation.amount.length !=0 && (isNaN(vm.donation.amount))) {
				vm.amount_invalid = true;
				vm.phone_email_absent = false;
				vm.phone_invalid = false;
				return false;
			} else {
				vm.amount_invalid = false;
				vm.phone_invalid = false;
				vm.phone_email_absent = false;
				return true;
			}
		}


		vm.addDonation = function() {
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
						donor_phone : vm.donation.phone, eighty_g_required : vm.donation.eighty_g, address : vm.donation.address, fundraiser_id : fundraiser_id, 
						created_at : $filter("date")(vm.donation.created_at, "yyyy-MM-dd"), format : 'json'}

				}).success(function (data) {
					vm.is_processing = false;

					var alert = $mdDialog.alert().title('Success!').content('Donation successfully added. ID: ' + data.donation.id).ok('Ok');
					$mdDialog.show(alert);

				}).error(function (data) {
					vm.is_processing = false;
					vm.is_error = true;

					var alert = $mdDialog.alert().title('Error!').content('Connection issue with \''+$rootScope.base_url + 'donation/add'+'\'. Please try again later.').ok('Ok');
					$mdDialog.show(alert);
				});

			} else {
				vm.is_processing = false;

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
			vm.donation.address = "";
			vm.donation.eighty_g = "false";
		};

  }]);
