angular.module("tvApp")
.controller("ShowController", function($scope, $stateParams) {
  $scope.id = $stateParams.id;
})
.controller("ShowsController", function($scope) {

})
;
