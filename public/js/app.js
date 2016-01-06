(function() {
  'use strict';

  angular.module('tvApp', ["ui.router", "ui.bootstrap", "angular-loading-bar"])
  .config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
    $urlRouterProvider.otherwise("/");
    $stateProvider
    .state("home", {
      url: "/",
      templateUrl: "/views/home.html",
      controller: "HomeController as home"
    })
    .state("movies", {
      url: "/movies",
      template: "<div ui-view></div>"
    })
    .state("shows", {
      url: "/shows",
      template: "<div ui-view>Hello TV<br /> <a ui-sref='shows.show({id:123})'>One Show</a></div> <br />"
    })
    .state("shows.show", {
      url: "/one/{id:int}",
      controller: "ShowController as show",
      template: "<div>Hello One Show: {{id}}</div>"
    })
    .state("movies.movie", {
      url: "/one/{id:int}",
      controller: "MovieCtrl",
      templateUrl: "/views/movie.html"
      //template: "<div>Hello One Show: <pre>{{movie | json}}</pre></div>"
    })
    .state("watchlistShows", {
      url: "/watchlist/shows",
      controller: function($scope) {
        $scope.data = {one:1, two:2};
      },
      template: "<div>Hello {{data.one}}"
    })
    .state("watchlistMovies", {
      url: "/watchlist/movies",
      controller: 'watchlistMovieCtrl',
      templateUrl: "/views/watchlist.html"
    })
    ;
  });

})();
