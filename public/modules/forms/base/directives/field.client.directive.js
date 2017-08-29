'use strict';

// coffeescript's for in loop
var __indexOf = [].indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
        if (i in this && this[i] === item) return i;
    }
    return -1;
};

angular.module('forms').directive('fieldDirective', ['$http', '$compile', '$rootScope', '$templateCache', 'supportedFields',
    function($http, $compile, $rootScope, $templateCache, supportedFields) {

    var getTemplateUrl = function(fieldType) {
        var type = fieldType;
        var templateUrl = 'modules/forms/base/views/directiveViews/field/';

		if (__indexOf.call(supportedFields, type) >= 0) {
            templateUrl = templateUrl+type+'.html';
        }
   		return $templateCache.get(templateUrl);
    };

    return {
        template: '<div>{{field.title}}</div>',
        restrict: 'E',
		scope: {
            field: '=',
            required: '&',
            design: '=',
            index: '=',
			forms: '='
        },
        link: function(scope, element) {

			$rootScope.chooseDefaultOption = scope.chooseDefaultOption = function(type) {
				if(type === 'yes_no'){
					scope.field.fieldValue = 'true';
				}else if(type === 'rating'){
					scope.field.fieldValue = 0;
				}else if(scope.field.fieldType === 'radio'){
					scope.field.fieldValue = scope.field.fieldOptions[0];
				}else if(type === 'legal'){
					scope.field.fieldValue = 'true';
					$rootScope.nextField();
				}
			};

      scope.getFieldOptions = function() {
        if(!scope.field.fileOptions && !scope.field.manualOptions) {
          return scope.field.fieldOptions;
        } else {
        	if (scope.field.fieldOptionsFromFile) {
        		return scope.field.fileOptions;
        	} else {
        		return scope.field.manualOptions;
        	}
        }
      };

            scope.setActiveField = $rootScope.setActiveField;

            //Set format only if field is a date
            if(scope.field.fieldType === 'date'){
                scope.dateOptions = {
                    changeYear: true,
                    changeMonth: true,
                    dateFormat: 'dd M yy',
                    yearRange: '1900:+0'
                };
            }

            var fieldType = scope.field.fieldType;

			if(scope.field.fieldType === 'number' || scope.field.fieldType === 'textfield' || scope.field.fieldType === 'email' || scope.field.fieldType === 'link'){
				switch(scope.field.fieldType){
					case 'textfield':
						scope.input_type = 'text';
						break;
					case 'email':
						scope.input_type = 'email';
						scope.placeholder = 'joesmith@example.com';
						break;
					case 'number':
                        scope.input_type = 'text';
						scope.validateRegex = /^-?\d+$/;
                        break;
                    default:
						scope.input_type = 'url';
						scope.placeholder = 'http://example.com';
						break;
				}
				fieldType = 'textfield';
			}

      if (scope.field.fieldType === 'dropdown') {
      	scope.getFieldOptions();
      }

            var template = getTemplateUrl(fieldType);
           	element.html(template).show();
            var output = $compile(element.contents())(scope);
        }
    };
}]);
