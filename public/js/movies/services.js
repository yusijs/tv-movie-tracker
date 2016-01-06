angular.module("tvApp")
.factory('watchlistMoviesFactory', function($http) {
  var factory = {};
  factory.getAll = function() {
    return $http({method: "GET", url: "/api/watchlist/movies"});
  };
  factory.getAllId = function() {
    return $http({method: "GET", url: "/api/watchlist/movies/id"});
  };
  factory.getOne = function(movieId) {
    return $http({method: "GET", url: "/api/watchlist/movies/"+movieId});
  };
  factory.put = function(movieId) {
    return $http({method:"PUT", url: "/api/watchlist/movies/"+movieId});
  };
  factory.delete = function(movieId) {
    return $http({method: "DELETE", url: "/api/watchlist/movies/"+movieId});
  };
  return factory;
})
.factory("moviesFactory", function($http) {
  var factory = {};
  factory.getOne = function(movieId) {
    return $http({method: "GET", cache: true, url: "/api/movie/"+movieId});
  };
  return factory;
})
;
