angular.module("tvApp")
.directive("watchlistMovies", function() {
  return  {
    restrict: "E",
    templateUrl: "/views/templates/watchlist.html"
  };
})
.directive("movies", function() {
  return {
    restrict: "E",
    templateUrl: "/views/templates/movie.html"
  };
})
.directive("movie", function() {
  return {
    restrict: "E",
    templateUrl: "/views/movie.html"
  };
})
;
