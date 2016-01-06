angular.module("tvApp")
.directive("upcomingMovies", function() {
  return {
    restrict: "E",
    templateUrl: "/views/templates/movie.html"
  };
})
;
