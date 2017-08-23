'use strict';

exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: [
		'globals.js',
		'login.js',
		'add-donation.js',
		'add-nach-donation.js',
		'add-online-donation.js'
	],

	onPrepare: function() {
		/* global angular: false, browser: false, jasmine: false */

		// var ConnectDatabase = require("../db-connect");
		// var db_connection = new ConnectDatabase();
		// var db = db_connection.connection;
		// db.connect();

		// // Delete all donations by the test user.
		// db.query('DELETE FROM donations WHERE donour_id=7062', function(err, rows, fields) {
		// 	if (err) console.log("Pretest Prepare - SQL Query returns Error: DELETE FROM donations WHERE donour_id=7062");
		// });
		// db.end();

		// Disable animations so e2e tests run more quickly
		var disableNgAnimate = function() {
		  angular.module('disableNgAnimate', []).run(['$animate', function($animate) {
			$animate.enabled(false);
		  }]);
		};

		browser.addMockModule('disableNgAnimate', disableNgAnimate);
	}

};

// exports.config = {
//   specs: [
//   	'login.js', 
//   	'add-donation.js'
//   ],
//   allScriptsTimeout: 11000,

//   baseUrl: 'http://localhost:8000/',
//   seleniumAddress: 'http://localhost:4444/wd/hub',

//   framework: 'jasmine2',

//   capabilities: {
//     // Fix element scrolling behavior in Firefox for fixed header elements (like angularjs.org has)
//     'elementScrollBehavior': 1
//   },

//     // Store the name of the browser that's currently being used.
//     browser.getCapabilities().then(function(caps) {
//       browser.params.browser = caps.get('browserName');
//     });
//   },

//   jasmineNodeOpts: {
//     defaultTimeoutInterval: 60000,
//     showTiming: true
//   }
// };
