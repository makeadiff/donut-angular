'use strict';

/**
 * @ngdoc function
 * @name donutApp.controller:AddNACHDonationCtrl
 * @description
 * # AddNACHDonationCtrl
 * Controller of the donutApp
 */
angular.module('donutApp')
	.controller('AddNACHDonationCtrl', ['$http','$mdDialog','UserService','$location', '$routeParams', '$filter', '$rootScope',function($http,$mdDialog,User,$location,$routeParams, $filter, $rootScope) {
		var vm = this; //vm stands for view-model

		//Initializing fields to be empty otherwise fields contain undefined.
		vm.donation = {
			'name'      : "",
			'phone'     : "",
			'email'     : "",
			'address'   : "",
			'amount'    : "",
			'type' 		: "nach",
			'created_at': new Date()
		};

		var params = $location.search();

		if(params.donor_name) vm.donation.name = params.donor_name;
		if(params.donor_phone) vm.donation.phone = params.donor_phone;
		if(params.donor_email) vm.donation.email = params.donor_email;
		if(params.donor_city) vm.donation.address = params.donor_city;
		if(params.amount) vm.donation.amount = params.amount;

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

			} else if(vm.donation.phone.length < 10 || vm.donation.phone.length > 15) {
				vm.phone_invalid = true;
				return false;

			} else if(!vm.donation.email.match(/^[\w\-\+\.]+\@[\w\-\.]+\.[\w]{2,5}$/)) {
				vm.email_invalid = true;
				return false;

			} else if(vm.donation.amount.length !=0 && (isNaN(vm.donation.amount))) {
				vm.amount_invalid = true;
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

		vm.initialize = function() {
			//Initializing fields to be empty otherwise fields contain undefined.
			vm.donation = {
				'name'      : "",
				'phone'     : "",
				'email'     : "",
				'address'   : "",
				'amount'    : "",
				'type' 		: "nach",
				'created_at': new Date()
			};
		}

		vm.addExDonation = function() {
			vm.is_processing = true;

			if(User.checkLoggedIn()) {
				var fundraiser_id = User.getUserId();

				$http({
					method: 'POST',
					url: $rootScope.base_url + 'donations',
					headers: $rootScope.request_headers,
					transformRequest: $rootScope.transformRequest,
					data: {amount : vm.donation.amount, donor_name : vm.donation.name, donor_email : vm.donation.email, donor_address: "",
						donor_phone : vm.donation.phone, fundraiser_user_id : fundraiser_id,
						added_on : $filter("date")(vm.donation.created_at, "yyyy-MM-dd"),
						type : vm.donation.type, format : 'json'}

				}).success(function (data) {
					vm.is_processing = false;

					if(data.success) {
						var alert = $mdDialog.alert().title('Success!').content('Donation of Rs '+vm.donation.amount+' from donor \''+vm.donation.name+'\' added succesfully(Donation ID: ' + data.data.donation.id + ')').ok('Ok');
					} else {
						var alert = $mdDialog.alert().title('Error!').content(data.message).ok('Ok');
					}
					$mdDialog.show(alert).finally(vm.initialize);

				}).error(function (data) {
					vm.is_processing = false;
					vm.is_error = true;

					var alert = $mdDialog.alert().title('Error!').content('Connection issue with \''+$rootScope.base_url + 'donations' + '\'. Please try again later.').ok('Ok');
					$mdDialog.show(alert).finally(vm.initialize);
				});


			} else {
				vm.is_processing = false;
				vm.is_error = true;

				var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
				$mdDialog.show(alert);
				$location.path('/login');
			};

			//So that form is reset after submit
			vm.donationForm.$setUntouched();
			vm.donationForm.$setPristine();
		};
	}]);
