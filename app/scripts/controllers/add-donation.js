'use strict';

/**
 * @ngdoc function
 * @name donutApp.controller:AddDonationCtrl
 * @description
 * # AddDonationCtrl
 * Controller of the donutApp
 */
angular.module('donutApp')
  .controller('AddDonationCtrl', ['$http','$mdDialog','UserService','$location',function ($http,$mdDialog,User,$location) {

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





        vm.validCheck = function() {
            if(vm.donationForm.$valid == false){
                return false;
            }else if(parseInt(vm.donation.amount) > 200 && vm.donation.phone == "" && vm.donation.email == "") {
                vm.phone_email_absent = true;
                return false;
            }else if(vm.donation.phone.length !=0 && (vm.donation.phone.length != 10 || (isNaN(vm.donation.phone)))) {
                vm.phone_invalid = true;
                return false;
            }else if(vm.donation.amount.length !=0 && (isNaN(vm.donation.amount))) {
                vm.amount_invalid = true;
                vm.phone_email_absent = false;
                vm.phone_invalid = false;
                return false;
            }else{
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
                    url: 'http://cfrapp.makeadiff.in:3000/donations/',
                    withCredentials : true,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','Access-Control-Allow-Origin': 'Origin, X-Requested-With, Content-Type, Accept',
                        'Authorization' : 'Basic ' + window.btoa('mad:mad')},
                    transformRequest: function(obj) {
                        var str = [];
                        for(var p in obj)
                        {
                            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                        }

                        return str.join('&');
                    },
                    transformResponse : function(data) {
                        var x2js = new X2JS();
                        var json = x2js.xml_str2json( data );
                        return json;
                    },
                    data: {amount: vm.donation.amount, first_name: vm.donation.name, email_id : vm.donation.email,
                        phone_no : vm.donation.phone, eighty_g_required : vm.donation.eighty_g, address : vm.donation.address, fundraiser_id : fundraiser_id, product_id : 'GEN',
                        donation_type : 'GEN', format : 'xml'}

                }).success(function (data) {

                    vm.is_processing = false;

                    var alert = $mdDialog.alert().title('Success!').content('Donation successfully added. ID: ' + data.donation.id.__text).ok('Ok');
                    $mdDialog.show(alert);

                }).error(function (data) {

                    vm.is_processing = false;

                    var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
                    $mdDialog.show(alert);

                });

                //Initializing fields to be empty otherwise fields contain undefined.
                vm.donation = {};
                vm.donation.name = "";
                vm.donation.amount = "";
                vm.donation.email = "";
                vm.donation.phone = "";
                vm.donation.address = "";
                vm.donation.eighty_g = "false";


            }else {
                var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
                $mdDialog.show(alert);
                $location.path('/login');
            }


        };

  }]);
