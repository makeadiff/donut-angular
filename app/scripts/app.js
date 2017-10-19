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
		// controller: 'AddDonationCtrl',
		restricted : true,
		title : 'Add Donation'
	  })
	  .when('/view-donation', {
		templateUrl: 'views/view-donation.html',
		// controller: 'ViewDonationCtrl',
		restricted : true,
		title : 'View Donation'
	  })
	  .when('/deposit', {
		templateUrl: 'views/deposit.html',
		// controller: 'DepositCtrl',
		restricted : true,
		title : 'Make a Deposit'
	  })
	  .when('/login', {
		templateUrl: 'views/login.html',
		// controller: 'LoginCtrl',
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
		// controller: 'SelectEventCtrl',
		restricted : true
		})
	  .when('/external-donation', {
		templateUrl: 'views/external-donation.html',
		// controller: 'ExternalDonationCtrl',
		restricted : true,
		title: "External Donations"
		})
	  .when('/add-external-donation/:donation_type', {
		templateUrl: 'views/add-external-donation.html',
		// controller: 'AddExternalDonationCtrl',
		restricted : true,
		title: "Add External Donations"
		})
	  .when('/add-nach-donation', {
		templateUrl: 'views/add-nach-donation.html',
		// controller: 'AddNACHDonationCtrl',
		restricted : true,
		title: "Add NACH Donation"
		})
	  .when('/add-online-donation', {
		templateUrl: 'views/add-online-donation.html',
		// controller: 'AddOnlineDonationCtrl',
		restricted : true,
		title: "Add Online Donation"
		})
	  .when('/approvals', {
		templateUrl: 'views/approvals.html',
		restricted : true,
		title: "Review Deposits"
		})
	  .when('/approved-donations', {
		templateUrl: 'views/approved-donations.html',
		restricted : true,
		title: "Approved Donations"
		})
	  .when('/change-password', {
		templateUrl: 'views/change-password.html',
		// controller: 'ChangePasswordCtrl',
		restricted : true,
		title : 'Change Password'
	  })
	  .otherwise({
		redirectTo: '/'
	  });
  })
	.run(['$location', '$rootScope', '$mdDialog', '$localStorage', 'UserService', function($location, $rootScope, $mdDialog, $localStorage, User) {
		$rootScope.base_url = 'http://makeadiff.in/apps/exdon-beta/api/';
		if(location.href.toString().match(/localhost/) || location.href.toString().match(/192\.168\./)) {
			$rootScope.base_url = 'http://192.168.1.13/MAD/apps/exdon/api/';
		}
		// $rootScope.base_url = 'http://localhost/makeadiff.in/home/makeadiff/public_html/apps/exdon/api/';
		// $rootScope.base_url = 'http://makeadiff.in/apps/exdon/api/';
		// $rootScope.base_url = 'http://makeadiff.in/apps/exdon-beta/api/';

		if(User.getUserName()) {
			$rootScope.user_name = User.getUserName();

			if(User.isPOC()) $rootScope.user_name += "(Coach)";
			if(User.isFC()) $rootScope.user_name += "(Finance Fellow)";
		}
		
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

			window.Intercom("boot", {
		        app_id: "xnngu157",
		        email: $localStorage.user.email,
		        name: $localStorage.user.name,
		        user_id: $localStorage.user.user_id,
		        widget: {
		          activator: "#IntercomDefaultWidget"
		        }
		    });
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
		// A mapping of all the possible status and a text for it - rather than just a formatting.
		var mapping = {
			'ecs' : 'ECS',
			'globalgiving' : 'Global Giving',
			'online' : 'Online',
			'other' : 'Other',
			'nach' : 'NACH',
			'global_giving' : 'Global Giving',
			'mad_website' : 'Website',
			'give_india' : 'Give India',
			'DEPOSIT COMPLETE' : 'Deposit Complete',
			'DEPOSIT_PENDING' : 'Deposit Deposit Pending',
			'HAND_OVER_TO_FC_PENDING' : 'Collection by Finance Fellow Pending',
			'RECEIPT PENDING' : 'Receipt Pending',
			'RECEIPT SENT' : 'Receipt Sent',
			'TO_BE_APPROVED_BY_POC' : 'To be collected by Coach',
			'pending': 'Pending Approval',
			'approved': 'Approved'
		};

		return function(input) {
			var text = input;
			for(var replace_this in mapping) {
				var replace_that = mapping[replace_this];

				text = text.replace(replace_this, replace_that);
			}
			return text;
		}
	})
	.filter('textFormat', function() {
		return function(input) {
			if(!input) return "";
			input = input.replace(/[_\-]/g, ' ')		//Changes 'hello_cruel-world' to 'hello cruel world'
				.replace(/([a-zA-Z])(\d)/g, '$1 $2')	//Changes 'no1' to 'no 1'
				.replace(/([a-z])([A-Z])/g, '$1 $2');	//Changes 'helloWorld' to 'hello World'

			var text = input.toLowerCase().split(' ').map(function(word) {
					return word.replace(word[0], word[0].toUpperCase());
				}).join(' ');

			return text;
		};
	});

