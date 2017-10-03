'use strict';


angular.module('forms').directive('resubmitDirective', ['$http', '$rootScope', 'Auth', 'localStorageService', 'uiGridConstants', 'moment',
  function($http, $rootScope, Auth, localStorageService, uiGridConstants, moment) {
    return {
      templateUrl: 'modules/forms/base/views/directiveViews/form/resubmitted-form.client.view.html',
      restrict: 'E',
      scope: {
        myform: '='
      },
      controller: function($document, $window, $scope) {

        var DEFAULT_PAGE_SIZE = 20;
        var savedForms = localStorageService.get($scope.myform._id);
        var resubmittedForms = [];

        var getPageOptions = {
          pageNumber: 1,
          pageSize: DEFAULT_PAGE_SIZE,
          sortField: 'created',
          sortDirection: -1
        };

        $scope.button_clicked = false;
        $scope.show_success = false;
        $scope.show_error = false;

        $scope.gridOptions = {
          enableColumnMenus: false,
          enableVerticalScrollbar: uiGridConstants.scrollbars.ALWAYS,
          enableHorizontalScrollbar: uiGridConstants.scrollbars.ALWAYS,

          enableRowHeaderSelection: true,
          enableFullRowSelection: true,
          enableSelectAll: true,
          multiSelect: true,

          paginationPageSize: DEFAULT_PAGE_SIZE,
          paginationPageSizes: [ DEFAULT_PAGE_SIZE ],
          useExternalPagination: false,

          useExternalSorting: false,

          columnDefs: [
            {
              name: 'Reference Number',
              field: '_id',
              enableCellEdit: false,
              enableSorting: true,
              sortDirectionCycle: [ uiGridConstants.ASC, uiGridConstants.DESC ],
              width: '50%',
              minWidth: 200
            },
            {
              name: 'Submission Time',
              field: 'created',
              enableCellEdit: false,
              enableSorting: true,
              sort: { direction: uiGridConstants.DESC },
              defaultSort: { direction: uiGridConstants.DESC },
              sortDirectionCycle: [ uiGridConstants.ASC, uiGridConstants.DESC ],
              width: '50%',
              minWidth: 200
            }
          ],
          onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;

            gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
              if (sortColumns.length == 0) {
                getPageOptions.sortField = null;
                getPageOptions.sortDirection = null;
              } else {
                getPageOptions.sortField = sortColumns[0].field;
                getPageOptions.sortDirection = sortColumns[0].sort.direction === 'asc' ? 1 : -1;
              }
              getPage();
            });

            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
              getPageOptions.pageNumber = newPage;
              getPageOptions.pageSize = pageSize;
              getPage();
            });

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
              $scope.selectedRows = gridApi.selection.getSelectedRows();
            });

            gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
              $scope.selectedRows = gridApi.selection.getSelectedRows();
            });
          }
        };

        var getPage = function() {
          $scope.selectedRows = undefined;
          $scope.gridOptions.totalItems = savedForms === null ? 0 : savedForms.length;
          $scope.gridOptions.data = [];
          
          if (savedForms === null) {
            return;
          }

          var gridData = [];
          for (var i = 0; i < savedForms.length; i++) {
            var sForm = savedForms[i];
            gridData.push({
              '_id': sForm['submissionId'],
              'created': moment(sForm['timestamp']).tz('Asia/Singapore').format('DD MMM YYYY hh:mm:ss A')
            });
          }
          
          $scope.gridOptions.data = gridData;
        };

        $scope.deleteSubmissions = function() {
          $scope.button_clicked = true;
          var submissionIds = $scope.selectedRows.map(row => row._id);
          savedForms = _.filter(savedForms, function(f) { return submissionIds.indexOf(f.submissionId) < 0 });
          localStorageService.set($scope.myform._id, savedForms);
          $scope.button_clicked = false;
          getPage();
        }

        var resubmitForm = function() {
          if (resubmittedForms.length === 0) {
            $scope.button_clicked = false;  
            $scope.show_success = true;

            window.setTimeout(function() {
                $scope.$apply(function() {
                  $scope.show_success = false;
                });
            }, 4000);

            return;
          }
          var form = resubmittedForms.pop()['form'];
          $http.post('/forms/' + form.admin.agency.shortName + '/' + form._id + '/submissions', form)
            .success(function(data, status, headers) {
              console.log('Form successfully resubmitted');
              resubmitForm();
            })
            .error(function(error) {
              $scope.button_clicked = false;
              $scope.show_error = true;
              window.setTimeout(function() {
                  $scope.$apply(function() {
                    $scope.show_error = false;
                  });
              }, 4000);
              console.log('Form failed sending');
            });
        }

        $scope.resubmitSubmissions = function() {
          var submissionIds = $scope.selectedRows.map(row => row._id);
          resubmittedForms = _.filter(savedForms, function(f) { return submissionIds.indexOf(f.submissionId) >= 0 });
          $scope.button_clicked = true;
          resubmitForm();
        }

        getPage();

      }
    };
  }
]);
