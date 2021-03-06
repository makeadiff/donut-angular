'use strict';

/**
 * @ngdoc function
 * @name donutApp.controller:AddOnlineDonationCtrl
 * @description
 * # AddOnlineDonationCtrl
 * Controller of the donutApp
 */
angular.module('donutApp')
	.controller('AddOnlineDonationCtrl', ['$http','$mdDialog','UserService','$location', '$routeParams', '$filter', '$rootScope',function($http,$mdDialog,User,$location,$routeParams, $filter, $rootScope) {
		var vm = this; //vm stands for view-model

		//Initializing fields to be empty otherwise fields contain undefined.
		vm.donation = {
			'name'      : "",
			'phone'     : "",
			'email'     : "",
			'address'   : "",
			'amount'    : "",
			'source'	: "give_india",
			'created_at': moment().toDate(),
			'donation_repeat_count': 1
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
		vm.donation_repeat_count_invalid = false;
		vm.is_processing = false;

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
				'source' : "give_india",
				'created_at'    : new Date(),
				'donation_repeat_count' : 1
			};
		}

		vm.addExDonation = function() {
			vm.is_processing = true;
		
			var fundraiser_id = User.getUserId();
			if(!fundraiser_id) {
				var error = $mdDialog.alert().title('Error!').content('Session error! Please login again.').ok('Ok');
				$mdDialog.show(alert).finally(vm.initialize);
				return false;
			}

			const comment = JSON.stringify({"source": vm.donation.source});

			var donation_data = {
				amount : vm.donation.amount, 
				donor_name : vm.donation.name, 
				donor_email : vm.donation.email,
				donor_phone : vm.donation.phone, 
				fundraiser_user_id : fundraiser_id,
				added_on : $filter("date")(vm.donation.created_at, "yyyy-MM-dd"),
				type : "crowdfunding_patforms", 
				comment: comment,
				format : 'json'
			}

			$http({
				method: 'POST',
				url: $rootScope.base_url + 'donations',
				headers: $rootScope.request_headers,
				transformRequest: $rootScope.transformRequest,
				data: donation_data
			}).success(function (data) {
				vm.is_processing = false;

				if(data.status == 'success') {
					var alert = $mdDialog.alert().title('Success!').content('Donation of Rs ' + vm.donation.amount +' from donor \''+vm.donation.name+'\' added succesfully(Donation ID: ' + data.data.donation.id + ')').ok('Ok');
				} else {
					var alert = $mdDialog.alert().title('Error!').content('Error in creating the donation - please try again after some time.').ok('Ok');
				}
				$mdDialog.show(alert).finally(vm.initialize);

			}).error(function (data) {
				vm.is_processing = false;
				vm.is_error = true;

				var alert = $mdDialog.alert().title('Error!').content('Connection issue with \'/donations\'. Please try again later.').ok('Ok');
				$mdDialog.show(alert).finally(vm.initialize);
			});
			
			//Form should be reset after submit
			vm.donationForm.$setUntouched();
			vm.donationForm.$setPristine();
		};

	}]);
