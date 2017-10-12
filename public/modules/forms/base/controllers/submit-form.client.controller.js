'use strict';

// SubmitForm controller
angular.module('forms').controller('SubmitFormController', [
	'$scope', '$rootScope', '$state', '$translate', 'myForm', 'Auth', 'User',
	function($scope, $rootScope, $state, $translate, myForm, Auth, user) {
		$scope.authentication = Auth;
		$scope.myform = myForm;

        
		$rootScope.isCollaborator = function() {
			$scope.user = $rootScope.user = Auth.ensureHasCurrentUser(user);
            if ($scope.user && (($scope.myform.admin._id === $scope.user._id) || ($scope.myform.collaborators.indexOf($scope.user.email)))) {
                return true;
            } else {
                return false
            }

        }

		$translate.use(myForm.language);
	}
]);
