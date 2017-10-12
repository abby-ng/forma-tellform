'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
    $httpProvider.interceptors.push(function($q, $location, $window) {
      return {
        responseError: function(response) {
          if (response.status === 401) {
            $window.location.assign('/#!/signin');
          } else if(response.status === 403){
            $window.location.assign('/#!/forms');
          }

          return $q.reject(response);
        }
      };
    });
  }]);
