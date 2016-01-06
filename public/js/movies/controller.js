angular.module("tvApp")
.controller("watchlistMovieCtrl", ['$scope', 'watchlistMoviesFactory', function($scope, watchlistMoviesFactory) {
  watchlistMoviesFactory.getAll().then(function(response) {
    $scope.myMovies = response.data;
    $scope.title = "Movie";
    console.log(response.data);
  });
}])
.controller("MovieCtrl", function($scope, $stateParams, moviesFactory, watchlistMoviesFactory) {
  var id = $stateParams.id;
  watchlistMoviesFactory.getAll().then(function success(response) {
    $scope.watchlist = [];
    for(i=0;i<response.data.length;i++) {
      $scope.watchlist.push(response.data[i].id);
    }
  });
  moviesFactory.getOne(id).then(function success(response) {
    $scope.movie = response.data;
  }, function failed(response) {
    alert("Went full retard capn");
    console.log(response);
  });
  $scope.id = id;
  $scope.addToWatchlist = function(id) {
    watchlistMoviesFactory.put(id).then(function(response) {
      console.log(response);
    });
  };
  $scope.removeFromWatchlist = function(id) {
    watchlistMoviesFactory.delete(id);
  };
})
;
