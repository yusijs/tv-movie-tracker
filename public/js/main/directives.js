angular.module("tvApp")
.directive("upcomingMovies", function() {
  return {
    restrict: "E",
    templateUrl: "/views/templates/movie.html"
  };
});

var compareTo = function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
};

angular.module("tvApp").directive("compareTo", compareTo);
