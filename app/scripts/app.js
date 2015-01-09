'use strict';

/**
 * @ngdoc overview
 * @name donutApp
 * @description
 * # donutApp
 *
 * Main module of the application.
 */
angular
  .module('donutApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'ngStorage'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        restricted : true,
        title : 'Home'
      })
      .when('/add-donation', {
        templateUrl: 'views/add-donation.html',
        controller: 'AddDonationCtrl',
        restricted : true,
        title : 'Add Donation'
      })
      .when('/view-donation', {
        templateUrl: 'views/view-donation.html',
        controller: 'ViewDonationCtrl',
        restricted : true,
        title : 'View Donation'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        restricted : false,
        title : 'Login'
      })
      .when('/logout', {
        templateUrl: 'views/logout.html',
        controller: 'LogoutCtrl',
        restricted : false
      })
      .when('/select-event', {
        templateUrl: 'views/select-event.html',
        controller: 'SelectEventCtrl',
        restricted : true

        })
      .when('/change-password', {
        templateUrl: 'views/change-password.html',
        controller: 'ChangePasswordCtrl',
        restricted : true,
        title : 'Change Password'

      })
      .otherwise({
        redirectTo: '/'
      });
  })
    .run(['$location', '$rootScope', function($location, $rootScope) {
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            $rootScope.title = ' |  ' + current.$$route.title;
        });
    }]);
