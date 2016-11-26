'use strict';

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [
  	'login.js', 
  	'add-donation.js'
  ],
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

//   onPrepare: function() {
//     /* global angular: false, browser: false, jasmine: false */

//     // Disable animations so e2e tests run more quickly
//     var disableNgAnimate = function() {
//       angular.module('disableNgAnimate', []).run(['$animate', function($animate) {
//         $animate.enabled(false);
//       }]);
//     };

//     browser.addMockModule('disableNgAnimate', disableNgAnimate);

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
