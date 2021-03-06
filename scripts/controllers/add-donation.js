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
		vm.donation.eighty_g = "false";
		vm.donation.type = "cash";

		var params = $location.search();

		if(params.donor_name != null) {
			vm.donation.name = params.donor_name;
		} else {
			vm.donation.name = "";
		}

		if(params.donor_phone != null) {
			vm.donation.phone = params.donor_phone;
		} else {
			vm.donation.phone = "";
		}

		if(params.donor_email != null) {
			vm.donation.email = params.donor_email;
		} else {
			vm.donation.email = "";
		}

		if(params.donor_city != null) {
			vm.donation.address = params.donor_city;
		} else {
			vm.donation.address = "";
		}

		if(params.amount != null) {
			vm.donation.amount = params.amount;
		} else {
			vm.donation.amount = "";
		}

		vm.donation.comment = "";
		vm.donation.cheque_no = "";

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
			} else if(vm.donation.phone.length < 10 || vm.donation.phone.length > 15) {
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
			
			var fundraiser_id = User.getUserId();
			if(parseInt(vm.donation.amount)>2000){
				vm.donation.eighty_g = "true";
			}

			//Validate donation
			$http({
				method: 'POST',
				url: $rootScope.base_url + 'donations/validate',
				headers: $rootScope.request_headers,
				transformRequest: $rootScope.transformRequest,
				data: {amount : vm.donation.amount, donor_name : vm.donation.name, donor_email : vm.donation.email,
					donor_phone : vm.donation.phone, donor_address : vm.donation.address,
					comment: vm.donation.comment, fundraiser_user_id : fundraiser_id,
					format : 'json'}

			}).success(function (data) {
				if(data.success){
					insertDonation();
				} else {
					var confirm_dialog = $mdDialog.confirm().title('Confirm').content(data.error).ok('Yes').cancel('No');
					$mdDialog.show(confirm_dialog).then(function() {
						insertDonation();
					}, function() {
						vm.is_processing = false;
					});
				}

			}).error(function (data) {
				vm.is_processing = false;
				vm.is_error = true;

				var alert = $mdDialog.alert().title('Error!').content('Connection issue with \''+$rootScope.base_url + 'donations/validate'+'\'. Please try again later.').ok('Ok');
				$mdDialog.show(alert);
			});

			var insertDonation = function(){
				$http({
					method: 'POST',
					url: $rootScope.base_url + 'donations',
					headers: $rootScope.request_headers,
					transformRequest: $rootScope.transformRequest,
					data: {amount : vm.donation.amount, donor_name : vm.donation.name, donor_email : vm.donation.email, 
						donor_phone : vm.donation.phone, eighty_g_required : vm.donation.eighty_g, donor_address : vm.donation.address,
						comment: vm.donation.comment, fundraiser_user_id : fundraiser_id, cheque_no: vm.donation.cheque_no,
						type: vm.donation.type, format : 'json'}
				}).success(function (data) {
					vm.is_processing = false;
					var alert = $mdDialog.alert().title('Success!').content('Donation of Rs '+vm.donation.amount+' from donor \''+vm.donation.name+'\' added succesfully(Donation ID: ' + data.data.donation.id + ')').ok('Ok');
					$mdDialog.show(alert);

					//Initializing fields to be empty otherwise fields contain undefined.
					vm.donation = {};
					vm.donation.name = "";
					vm.donation.amount = "";
					vm.donation.email = "";
					vm.donation.phone = "";
					vm.donation.address = "";
					vm.donation.comment = "";
					vm.donation.eighty_g = "false";

					//So that form is reset after submit
					vm.donationForm.$setUntouched();
					vm.donationForm.$setPristine();

				}).error(function (data) {
					vm.is_processing = false;
					vm.is_error = true;

					var alert = $mdDialog.alert().title('Error!').content('Connection issue with \''+$rootScope.base_url + 'donations\'. Please try again later.').ok('Ok');
					$mdDialog.show(alert);
				})
			};
		};

  }]);
