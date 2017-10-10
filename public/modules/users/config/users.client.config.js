'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
    $httpProvider.interceptors.push(function($q, $location, $window) {
      return {
        responseError: function(response) {
          if (response.status === 401) {
            console.log('401 access denied ...')
            // $window.location.assign('/#!/signin');
          } else if(response.status === 403){
            console.log('403 access denied ...')
            // $window.location.assign('/#!/access_denied');
          }

          return $q.reject(response);
        }
      };
    });
  }]);
