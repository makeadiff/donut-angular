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
        restricted : true
      })
      .when('/add-donation', {
        templateUrl: 'views/add-donation.html',
        controller: 'AddDonationCtrl',
        restricted : true
      })
      .when('/view-donation', {
        templateUrl: 'views/view-donation.html',
        controller: 'ViewDonationCtrl',
        restricted : true
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        restricted : false
      })
      .when('/logout', {
        templateUrl: 'views/logout.html',
        controller: 'LogoutCtrl',
        restricted : false
      })
      .when('/select-event', {
        templateUrl: 'views/select-event.html',
        controller: 'SelectEventCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
