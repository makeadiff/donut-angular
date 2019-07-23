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
		vm.initialize = function() {
			//Initializing fields to be empty otherwise fields contain undefined.
			vm.donation = {
				'name'      : "",
				'phone'     : "",
				'email'     : "",
				'address'   : "",
				'amount'    : "",
				'type' 		: "nach",
				'created_at': moment().toDate(),
				'nach_start_on': moment().toDate(),
				'nach_end_on': ""
			};
		}
		vm.initialize();
		//Setting up max and min date
		// vm.currentDate = new Date();
		// vm.beginDate =  moment("2018-03-31").toDate();

		// vm.minDate = new Date(
		//   vm.beginDate.getFullYear(),
		//   vm.beginDate.getMonth(),
		//   vm.beginDate.getDate()
		// );
	  
		// vm.maxDate = new Date(
		//   vm.currentDate.getFullYear(),
		//   vm.currentDate.getMonth(),
		//   vm.currentDate.getDate()
		// );

		//Initializing errors
		vm.is_error = false;
		vm.is_processing = false;

		vm.phone_absent = false;
		vm.email_absent = false;
		vm.phone_invalid = false;
		vm.email_invalid = false;
		vm.amount_invalid = false;
		vm.created_at_invalid = false;
		vm.nach_start_on_invalid = false;
		vm.nach_end_on_invalid = false;

		//getting values from URL
		var params = $location.search();

		if(params.donor_name) vm.donation.name = params.donor_name;
		if(params.donor_phone) vm.donation.phone = params.donor_phone;
		if(params.donor_email) vm.donation.email = params.donor_email;
		if(params.donor_city) vm.donation.address = params.donor_city;
		if(params.amount) vm.donation.amount = params.amount;

		vm.fundraiser_id = User.getUserId();
		
		$('#created_at').attr('min', moment("2018-04-01").format("YYYY-MM-DD"));
		$('#created_at').attr('max', moment().format("YYYY-MM-DD"));

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

			} else if(vm.donation.amount.length != 0 && (isNaN(vm.donation.amount) || vm.donation.amount < 100)) {
				vm.amount_invalid = true;
				return false;
			
			} else if (moment(vm.donation.created_at).isValid() && moment(vm.donation.created_at).isBefore(moment('2018-03-31')) && moment(vm.donation.created_at).isAfter(moment()) ){
				vm.created_at_invalid = true;
				return false;
				
			} else if (moment(vm.donation.created_at).isValid() && moment(vm.donation.created_at).isAfter(moment(vm.donation.nach_start_on))){
				vm.nach_start_on_invalid = true;
				return false;

			} else if(moment(vm.donation.created_at).isValid() && moment(vm.donation.nach_start_on).isAfter(moment(vm.donation.nach_end_on))){
				vm.nach_end_on_invalid = true;
				return false;
			} else { // No errors.
				vm.phone_absent = false;
				vm.email_absent = false;
				vm.phone_invalid = false;
				vm.email_invalid = false;
				vm.amount_invalid = false;
				vm.created_at_invalid = false;
				vm.nach_start_on_invalid = false;
				vm.nach_end_on_invalid = false;

				return true;
			}
		}

		vm.addExDonation = function() {
			vm.is_processing = true;

			if(User.checkLoggedIn()) {
				var fundraiser_id = User.getUserId();

				if(!vm.donation.nach_end_on) {
					vm.donation.amount = vm.donation.amount * 12;
				} else {
					var diff = vm.donation.nach_end_on.getTime() - vm.donation.nach_start_on.getTime();
					var months = Math.round(diff / (1000*60*60*24 * 30));
					vm.donation.amount = vm.donation.amount * months;
				}

				$http({
					method: 'POST',
					url: $rootScope.base_url + 'donations',
					headers: $rootScope.request_headers,
					transformRequest: $rootScope.transformRequest,
					data: {amount : vm.donation.amount, donor_name : vm.donation.name, donor_email : vm.donation.email, donor_address: "",
						donor_phone : vm.donation.phone, fundraiser_user_id : fundraiser_id,
						added_on : $filter("date")(vm.donation.created_at, "yyyy-MM-dd"),
						nach_start_on : $filter("date")(vm.donation.nach_start_on, "yyyy-MM-dd"),
						nach_end_on : $filter("date")(vm.donation.nach_end_on, "yyyy-MM-dd"),
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
