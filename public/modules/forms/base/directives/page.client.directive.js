'use strict';

angular.module('forms').directive('pageDirective', ['$compile', '$rootScope', '$templateCache',
  function($compile, $rootScope, $templateCache) {

    return {
      template: '<div></div>',
      restrict: 'E',
      scope: {
        page: '='
      },
      link: function(scope, element) {

        scope.exitStartPage = $rootScope.exitStartPage;
        scope.reloadForm = $rootScope.reloadForm;

        var templateUrl = 'modules/forms/base/views/directiveViews/page/';
        templateUrl = templateUrl + scope.page.type + '.html';
        var template = $templateCache.get(templateUrl);

        element.html(template).show();
        var output = $compile(element.contents())(scope);

      }
    };
  }
]);
