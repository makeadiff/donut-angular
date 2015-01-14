'use strict';

/**
 * @ngdoc function
 * @name donutApp.controller:ViewDonationCtrl
 * @description
 * # ViewDonationCtrl
 * Controller of the donutApp
 */
angular.module('donutApp')
  .controller('ViewDonationCtrl',['$http','$mdDialog','UserService','$location', function ($http,$mdDialog,User,$location) {

        var vm = this;

        vm.is_processing = true;
        vm.donations = {};

        if(User.checkLoggedIn()) {
            var fundraiser_id = User.getUserId();

            $http({
                method: 'POST',
                url: 'http://cfrapp.makeadiff.in:3000/mobile_reports/vol_report.json',
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
                data: {id : fundraiser_id}

            }).success(function (data) {

                vm.donations = data;
                vm.is_processing = false;


            }).error(function (data) {

                vm.is_processing = false;

                var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
                $mdDialog.show(alert);
                $location.path('/');

            });


        }else{

            vm.is_processing = false;

            var alert = $mdDialog.alert().title('Error!').content('Connection error. Please try again later.').ok('Ok');
            $mdDialog.show(alert);
            $location.path('/login');

        };
}]);
