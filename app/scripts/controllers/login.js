'use strict';

/**
 * @ngdoc function
 * @name donutApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the donutApp
 */
angular.module('donutApp')
  .controller('LoginCtrl', ['$http','$scope','$mdToast','UserService','$location',function($http,$scope,$mdToast,User, $location){

        var loginCtrl = this;

        loginCtrl.login = {};

        loginCtrl.login_invalid = false;
        loginCtrl.poc_not_assigned = false;

        loginCtrl.is_processing = false;

        loginCtrl.loginCheck = function() {

            loginCtrl.is_processing = true;

            $http({
                method: 'POST',
                url: 'http://cfrapp.makeadiff.in:3000/mobileauth/',
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
                data: {phone_no: loginCtrl.login.phone, password: loginCtrl.login.password, format: 'xml'}
            }).success(function (data) {

                if(data.user.id == 0) {
                    loginCtrl.is_processing = false;
                    User.unsetLoggedIn();
                    loginCtrl.login_invalid = true;
                    loginCtrl.poc_not_assigned = false;
                    loginCtrl.login = {};


                }else if(data.user.id == -1){
                    loginCtrl.is_processing = false;
                    User.unsetLoggedIn();
                    loginCtrl.poc_not_assigned = true;
                    loginCtrl.login_invalid = false;
                    loginCtrl.login = {};

                }else{
                    loginCtrl.is_processing = false;
                    User.setLoggedIn(data.user.id);

                    $location.path('/');
                }



            }).error(function(data){
                User.unsetLoggedIn();
            });



        };
}]);