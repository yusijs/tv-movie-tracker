angular.module("tvApp")
.controller("HomeController", function ($scope, upcoming, $log, $rootScope) {
  $rootScope.genrenamesById = {
    "12": "Adventure",
    "14": "Fantasy",
    "16": "Animation",
    "18": "Drama",
    "27": "Horror",
    "28": "Action",
    "35": "Comedy",
    "36": "History",
    "37": "Western",
    "53": "Thriller",
    "80": "Crime",
    "99": "Documentary",
    "878": "Science Fiction",
    "9648": "Mystery",
    "10402": "Music",
    "10749": "Romance",
    "10751": "Family",
    "10752": "War",
    "10769": "Foreign",
    "10770": "TV Movie"
  };
  $scope.auth = (typeof localStorage.getItem("auth-token") === null) ? 0 : 1;
  upcoming.getByPage().then(function(response) {
    console.log(response.data);
    $scope.pages = response.data.total_pages;
    $scope.items = response.data.total_results;
    $scope.page = response.data.page;
    $scope.movies = response.data.results;
  });


  $scope.setPage = function (pageNo) {
    $scope.page = pageNo;
  };

  $scope.pageChanged = function() {
    upcoming.getByPage($scope.page).then(function(response) {
      console.log(response.data);
      $scope.pages = response.data.total_pages;
      $scope.items = response.data.total_results;
      $scope.page = response.data.page;
      $scope.movies = response.data.results;
    });
  };
})
.controller("loginController", function($scope, $uibModal, $log, auth, $rootScope) {

  $scope.logMeOut = function() {
    $rootScope.auth = false;
    auth.logout();
  };


  $scope.open = function (size) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/views/login.html',
      controller: 'LoginInstanceCtrl',
      size: size
    });

    modalInstance.result.then(function () {
      // When logged in?
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
})
.controller("LoginInstanceCtrl", function($scope, $rootScope, $uibModalInstance, auth, AuthTokenFactory) {
  $scope.logMeIn = function (username,password) {
    auth.login(username,password).then(function success(response) {
      AuthTokenFactory.setToken(response.data.token);
      console.log(response.data);
      if(!response.data.token) {
        $scope.loginResults = response.data.message;
      }
      else {
        $rootScope.auth = true;
        $uibModalInstance.dismiss('cancel');
      }
    });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})
;
