'use strict';

angular.module('forms').directive('startEndDirective', ['$compile', '$rootScope', '$templateCache',
  function($compile, $rootScope, $templateCache) {

    return {
      template: '<div></div>',
      restrict: 'E',
      scope: {
        page: '='
      },
      link: function(scope, element) {

        console.log('in start end directive')
        console.log(scope)

        var templateUrl = 'modules/forms/base/views/directiveViews/start-end/';
        templateUrl = templateUrl + scope.page.type + '.html';
        var template = $templateCache.get(templateUrl);
        console.log(templateUrl)
        console.log(template)

        element.html(template).show();
        var output = $compile(element.contents())(scope);
      }
    };
  }
]);
