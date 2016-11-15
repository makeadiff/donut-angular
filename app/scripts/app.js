'use strict';

/**
 * @ngdoc overview
 * @name donutApp
 * @description
 * # donutApp
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
	  .when('/external-donation', {
		templateUrl: 'views/external-donation.html',
		controller: 'ExternalDonationCtrl',
		restricted : true,
		title: "External Donations"
		})
	  .when('/add-external-donation/:donation_type', {
		templateUrl: 'views/add-external-donation.html',
		controller: 'AddExternalDonationCtrl',
		restricted : true,
		title: "Add External Donations"
		})
	  .when('/add-nach-donation', {
		templateUrl: 'views/add-nach-donation.html',
		controller: 'AddNACHDonationCtrl',
		restricted : true,
		title: "Add NACH Donation"
		})
	  .when('/add-online-donation', {
		templateUrl: 'views/add-online-donation.html',
		controller: 'AddOnlineDonationCtrl',
		restricted : true,
		title: "Add Online Donation"
		})
	  .when('/approvals', {
		templateUrl: 'views/approvals.html',
		restricted : true,
		title: "Approve Donations"
		})
	  .when('/approved-donations', {
		templateUrl: 'views/approved-donations.html',
		restricted : true,
		title: "Approved Donations"
		})
	  .when('/fc-approvals', {
		templateUrl: 'views/fc-approvals.html',
		restricted : true,
		title: "Approve Donations"
		})
	  .when('/fc-approved-donations', {
		templateUrl: 'views/fc-approved-donations.html',
		restricted : true,
		title: "Approved Donations"
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
	.run(['$location', '$rootScope', '$mdDialog', 'UserService', function($location, $rootScope, $mdDialog, User) {
		$rootScope.base_url = 'http://localhost/Sites/community/makeadiff/makeadiff.in/apps/exdon/api/';
		// $rootScope.base_url = 'http://localhost/makeadiff.in/home/makeadiff/public_html/apps/exdon/api/';
		// $rootScope.base_url = 'http://makeadiff.in/apps/exdon/api/';
		
		$rootScope.user_name = User.getUserName();
		
		$rootScope.transformRequest = function(obj) {
			var str = [];
			for(var p in obj) { str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p])); }
			return str.join('&');
		}

		$rootScope.errorMessage = function(redirect_to, error_message) {
			if(!error_message) error_message = 'Connection error. Please try again later.';
			var alert = $mdDialog.alert().title('Error!').content(error_message).ok('Ok');
			$mdDialog.show(alert);

			if(!redirect_to.match(/^\/.+/)) redirect_to = '/';
			$location.path(redirect_to);

			return false;
		}

		$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
			if(current.$$route && current.$$route.title)
				$rootScope.title = current.$$route.title;
			else 
				$rootScope.title = "Donut";
		});
	}])
	.filter('dateToISO', function() {
		return function(input) {
			var t = input.split(/[- :]/); // Split timestamp into [ Y, M, D, h, m, s ]
			var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]); // Apply each element to the Date function
			return d.toISOString();
		};
	})
	.filter('statusFormat', function() {
		// :TODO:
		// Make a mapping of all the possible status and a text for it - rather than just a formatting.
		// 
		return function(input) {
			input = input.replace(/[_\-]/g, ' ')		//Changes 'hello_cruel-world' to 'hello cruel world'
				.replace(/([a-zA-Z])(\d)/g, '$1 $2')	//Changes 'no1' to 'no 1'
				.replace(/([a-z])([A-Z])/g, '$1 $2');	//Changes 'helloWorld' to 'hello World'

			var text = input.toLowerCase().split(' ').map(function(word) {
					return word.replace(word[0], word[0].toUpperCase());
				}).join(' ');

			text = text.replace('Poc', 'POC').replace('Fc', 'Finance Fellow');

			return text;
		};
	});;

