'use strict';

angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider, Authorization) {
		// Redirect to home view when route not found
		console.log("redirect to /signin")
		$urlRouterProvider.otherwise('/signin');
	}
	]);
