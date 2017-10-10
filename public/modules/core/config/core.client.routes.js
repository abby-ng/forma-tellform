'use strict';

angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider, Authorization) {
		// Redirect to home view when route not found
		console.log("redirect to /signin")
		$urlRouterProvider.otherwise('/signin');
	}
	]);

//Page access/authorization logic
angular.module(ApplicationConfiguration.applicationModuleName).run(['$rootScope', 'Auth', 'User', 'Authorizer', '$state', '$stateParams',
	function($rootScope, Auth, User, Authorizer, $state, $stateParams) {
		$rootScope.$on('$stateChangeStart', function(event, next) {
			var authenticator, permissions, user;
			permissions = next && next.data && next.data.permissions ? next.data.permissions : null;

			console.log('going to call ensureHasCurrentUser')
			Auth.ensureHasCurrentUser(User);
			user = Auth.currentUser;
			console.log('permissions', permissions)

			if(user){
				authenticator = new Authorizer(user);
				if( (permissions !== null) ){
					if( !authenticator.canAccess(permissions) ){
						console.log('going to permission denied')
						event.preventDefault();
						$state.go('access_denied');
					}
				}
			}
		});
	}]);
