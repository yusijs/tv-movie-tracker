angular.module("tvApp")
.factory("watchlistShows", function() {
  var factory = {};
  factory.getAll = function() {
    return $http({method: "GET", url: "/api/watchlist/shows"});
  };
  factory.getOne = function(movieId) {
    return $http({method: "GET", url: "/api/watchlist/shows/"+movieId});
  };
  factory.put = function(movieId) {
    $http({method:"PUT", url: "/api/watchlist/shows/"+movieId});
  };
  factory.delete = function(movieId) {
    $http({method: "DELETE", url: "/api/watchlist/shows/"+movieId});
  };
  return factory;
});
