'use strict';

// Forms controller
angular.module('forms').controller('ListFormsController', ['$rootScope', '$scope', '$stateParams', '$state', 'Forms', 'CurrentForm', '$http', '$uibModal',
	function($rootScope, $scope, $stateParams, $state, Forms, CurrentForm, $http, $uibModal) {

        $scope = $rootScope;
        $scope.forms = {};
        $scope.showCreateModal = false;

		$rootScope.languageRegExp = {
			regExp: /[@!#$%^&*()\-+={}\[\]|\\/'";:`.,~№?<>]+/i,
			test: function(val) {
				return !this.regExp.test(val);
			}
		};

		/*
		 ** DeleteModal Functions
		 */
		$scope.openDeleteModal = function(index){
			$scope.deleteModal = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'deleteModalListForms.html',
				controller:  function($uibModalInstance, items, $scope) {
					$scope.content = items;

					$scope.cancel = $scope.cancelDeleteModal;

					$scope.deleteForm = function() {
						$scope.$parent.removeForm(items.formIndex);
					};
				},
				resolve: {
					items: function() {
						return {
							currFormTitle: $scope.myforms[index].title,
							formIndex: index
						};
					}
				}
			});
		};


		$scope.cancelDeleteModal = function(){
			if($scope.deleteModal){
				$scope.deleteModal.dismiss('cancel');
			}
		};

        // Return all user's Forms
        $scope.findAll = function() {
            console.log('3');
            Forms.query(function(_forms){
                console.log('5');
                $scope.myforms = _forms;
            });
        };

        //Modal functions
        $scope.openCreateModal = function(){
            if(!$scope.showCreateModal){
                $scope.showCreateModal = true;
            }
        };
        $scope.closeCreateModal = function(){
            if($scope.showCreateModal){
                $scope.showCreateModal = false;
            }
        };

        $scope.setForm = function (form) {
            $scope.myform = form;
        };
        $scope.goToWithId = function(route, id) {
            $state.go(route, {'formId': id}, {reload: true});
        };

        $scope.duplicateForm = function(form_index) {
        	var id = $scope.myforms[form_index]._id;
            var title = $scope.myforms[form_index].title;
            
            // Only appends number when original form is copied, treats duplicates as originals too
            var copy_index = 1 
            var cur_title;
            var query_title = title + "_" + copy_index.toString()

            for (form_index = 0; form_index < $scope.myforms.length; form_index ++){
                
                cur_title = $scope.myforms[form_index].title
                if (cur_title == query_title) {
                    copy_index ++
                    query_title = title + "_" + copy_index.toString()
                    
                }
                if (cur_title > query_title) {
                    break
                }
            }

        	$http.post('/forms/' + id + '/duplicate', {name: copy_index})
        		.success(function(data, status, headers) {
        			$scope.myforms.splice(form_index, 0, data);
        		}).error(function(errorResponse) {
        			console.error(errorResponse);
        			if (errorResponse === null) {
        				$scope.error = errorResponse.data.message;
        			}
        		});
        };

        // Create new Form
        $scope.createNewForm = function(){

            var form = {};
            form.title = $scope.forms.createForm.title.$modelValue;
            form.language = $scope.forms.createForm.language.$modelValue;

            if($scope.forms.createForm.$valid && $scope.forms.createForm.$dirty){
                $http.post('/forms', {form: form})
                .success(function(data, status, headers){
                    // Redirect after save
                    $scope.goToWithId('viewForm.create', data._id+'');
                }).error(function(errorResponse){
                    console.error(errorResponse);
                    $scope.error = errorResponse.data.message;
                });
            }
        };

        $scope.removeForm = function(form_index) {
            if(form_index >= $scope.myforms.length || form_index < 0){
                throw new Error('Error: form_index in removeForm() must be between 0 and '+$scope.myforms.length-1);
            }

            $http.delete('/forms/'+$scope.myforms[form_index]._id)
                .success(function(data, status, headers){
                    //console.log('form deleted successfully');
                    $scope.myforms.splice(form_index, 1);
					$scope.cancelDeleteModal();
                }).error(function(error){
                    //console.log('ERROR: Form could not be deleted.');
                    console.error(error);
                });
        };
    }
]);
