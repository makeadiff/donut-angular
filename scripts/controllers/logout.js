'use strict';

/**
 * @ngdoc function
 * @name donutApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the donutApp
 */
angular.module('donutApp')
  .controller('LogoutCtrl',['$location','UserService', function ($location,User) {

        User.unsetLoggedIn();
        $location.path('/login');
  }]);
