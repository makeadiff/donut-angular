'use strict';

/**
 * @ngdoc overview
 * @name donutApp
 * @description
 * # donutApp
 */
angular
  .module('donutApp', [
  	// 'ngRaven',
	'ngAnimate',
	'ngCookies',
	'ngResource',
	'ngRoute',
	'ngSanitize',
	'ngTouch',
	'ngMaterial',
	'ngStorage'
  ])
  .config(function ($compileProvider) {
  	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|whatsapp):/);
  })
  .config(function ($routeProvider) {
	$routeProvider
	  .when('/', {
		templateUrl: 'views/home.html',
		title : 'Donut'
	  })
	  .when('/add-donation', {
		templateUrl: 'views/add-donation.html',
		title : 'Cash/ Cheque Donation',
		heading:'Add Cash / Cheque donations'
	  })
	  .when('/view-donation', {
		templateUrl: 'views/view-donation.html',
		title : 'View Donation',
		heading:'My Donations'
	  })
	  .when('/deposit', {
		templateUrl: 'views/deposit.html',
		title : 'Make a Deposit',
		heading:'Make a Deposit'
	  })
	  .when('/login', {
		templateUrl: 'views/login.html',
		restricted : false,
		title : 'Login'
	  })
	  .when('/logout', {
		templateUrl: 'views/logout.html',
		controller: 'LogoutCtrl',
	  })
	  .when('/select-event', {
		templateUrl: 'views/select-event.html',
		})
	  .when('/external-donation', {
		templateUrl: 'views/external-donation.html',
		title: "External Donations"
		})
	  .when('/add-external-donation/:donation_type', {
		templateUrl: 'views/add-external-donation.html',
		title: "Add External Donations"
		})
	  .when('/add-nach-donation', {
		templateUrl: 'views/add-nach-donation.html',
		title: "Add NACH Donation",
		})
	  .when('/add-online-donation', {
		templateUrl: 'views/add-online-donation.html',
		title: "Add Online Donation",
		})
	  .when('/approvals', {
		templateUrl: 'views/approvals.html',
		title: "Review Deposits"
		})
	  .when('/approved-donations', {
		templateUrl: 'views/approved-donations.html',
		title: "Approved Donations"
		})
	  .when('/find-approve', {
		templateUrl: 'views/find-approve.html',
		title : 'Find and Approve Donations'
	  })
	  .otherwise({
		redirectTo: '/'
	  });
	})
	.config(function($mdDateLocaleProvider) {
    /**
     * @param date {Date}
     * @returns {string} string representation of the provided date
     */
    $mdDateLocaleProvider.formatDate = function(date) {
      return date ? moment(date).format('DD/MM/YYYY') : '';
    };

    /**
     * @param dateString {string} string that can be converted to a Date
     * @returns {Date} JavaScript Date object created from the provided dateString
     */
    $mdDateLocaleProvider.parseDate = function(dateString) {
      var m = moment(dateString, 'DD/MM/YYYY', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };

    /**
     * Check if the date string is complete enough to parse. This avoids calls to parseDate
     * when the user has only typed in the first digit or two of the date.
     * Allow only a day and month to be specified.
     * @param dateString {string} date string to evaluate for parsing
     * @returns {boolean} true if the date string is complete enough to be parsed
     */
    $mdDateLocaleProvider.isDateComplete = function(dateString) {
      dateString = dateString.trim();
      // Look for two chunks of content (either numbers or text) separated by delimiters.
      var re = /^(([a-zA-Z]{3,}|[0-9]{1,4})([ .,]+|[/-]))([a-zA-Z]{3,}|[0-9]{1,4})/;
      return re.test(dateString);
    };
  })
	.run(['$location', '$rootScope', '$mdDialog', '$localStorage', 'UserService', function($location, $rootScope, $mdDialog, $localStorage, User) {
		$rootScope.base_url = window.location.protocol + '//' + window.location.hostname + '/api/v1/';
		
		if(location.href.toString().match(/localhost/) || location.href.toString().match(/192\.168\./)) {
			// $rootScope.base_url = 'http://localhost/MAD/api/v1/';
			$rootScope.base_url = 'http://localhost/Projects/Phoenix/v1/';
		}
		
		$rootScope.request_headers = {
			'Content-Type': 'application/x-www-form-urlencoded', 
			'Authorization': 'Basic ' + window.btoa('sulu.simulation@makeadiff.in:pass')
		};

		$rootScope.coach_group_id = 369; // This is actually the FR volunteer user group - change as need be.
		$rootScope.finance_fellow_group_id = 15;
		$rootScope.fr_fellow_group_id = 370;

		// MAD Year - code taken from Phoenix/Models/Common.php:__construct__
		var start_month = 5; // May
		var today = new Date();
        var year = today.getFullYear();
        var this_month = today.getMonth() + 1;
        if(this_month < start_month) year = year - 1;
		$rootScope.year = year;

		User.setLoggedIn(current_user);

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
			'online_recurring' : 'Online Recurring',
			'other' : 'Other',
			'nach' : 'NACH',
			'global_giving' : 'Global Giving',
			'mad_website' : 'Website',
			'give_india' : 'Give India',
			'DEPOSIT COMPLETE' : 'Deposit Complete',
			'DEPOSIT_PENDING' : 'Deposit Pending',
			'HAND_OVER_TO_FC_PENDING' : 'Collection by Finance Fellow Pending',
			'RECEIPT PENDING' : 'Receipt Pending',
			'RECEIPT SENT' : 'Receipt Sent',
			'TO_BE_APPROVED_BY_POC' : 'To be collected by Coach',
			'pending': 'Approval Pending',
			'approved': 'Approved',
			'cash': 'Cash',
			'collected': "Collected",
			'crowdfunding_platforms': "Crowdfunding Platforms"
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

