'use strict';

/**
 * @ngdoc function
 * @name donutApp.controller:ChangePasswordCtrl
 * @description
 * # ChangePasswordCtrl
 * Controller of the donutApp
 */
angular.module('donutApp')
  .controller('ChangePasswordCtrl', ['$http','$mdDialog','UserService','$location', function ($http,$mdDialog,User,$location) {

        var vm = this; //vm stand for view model

        vm.password = "";
        vm.password_confirmation = "";

        vm.password_not_match = false;
        vm.password_length_less = false;

        vm.is_processing = false;

        vm.validCheck = function() {
            if(vm.password == "" || vm.password_confirmation == ""){
                return false;
            }else if(vm.password != "" && vm.password_confirmation != "" && vm.password == vm.password_confirmation && vm.password.length <4)
            {
                vm.password_not_match = false;
                vm.password_length_less = true;
                return false;
            }else if(vm.password != "" && vm.password_confirmation != "" && vm.password != vm.password_confirmation){
                vm.password_not_match = true;
                vm.password_length_less = false;
                return false;
            }else{
                vm.password_not_match = false;
                vm.password_length_less = false;
                return true;
            }
        }


        vm.changePassword = function(){
            vm.is_processing = true;
            if(User.checkLoggedIn()) {
                var fundraiser_id = User.getUserId();
                $http({
                    method: 'PATCH',
                    url: 'http://cfrapp.makeadiff.in:3000/mobileauth/' + fundraiser_id,
                    withCredentials : true,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','Access-Control-Allow-Origin': 'Origin, X-Requested-With, Content-Type, Accept',
                        'Authorization' : 'Basic ' + window.btoa('mad:mad')},
                    transformRequest: function(obj) {
                        var str = [];
                        for(var p in obj){
                            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                        }

                        return str.join('&');
                    },
                    transformResponse : function(data) {
                        var x2js = new X2JS();
                        var json = x2js.xml_str2json( data );
                        return json;
                    },
                    data: {password: vm.password_confirmation}
                }).success(function (data) {

                    vm.is_processing = false;
                    var alert = $mdDialog.alert().title('Success!').content('Password succesfully changed').ok('Ok');
                    $mdDialog.show(alert);

                    $location.path('/');


                }).error(function(data){
                    vm.is_processing = false;
                    var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
                    $mdDialog.show(alert);



                });
            }else{

                vm.is_processing = false;

                var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
                $mdDialog.show(alert);
                $location.path('/login');

            };

            vm.password = "";
            vm.password_confirmation = "";

        }


  }]);
