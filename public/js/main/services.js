angular.module("tvApp")
.factory("upcoming", function($http) {
  var factory = {};
  factory.getByPage = function(page) {
    page = page ? page : 1;
    return $http({method: "GET", url: "/api/movies/upcoming/"+page});
};

  return factory;
})
.factory("auth", function($http, AuthTokenFactory) {
  var factory = {};
  factory.login = function(username,password) {
    return $http({method:"POST", url: "/login", data:{username:username,password:password}});
  };
  factory.logout = function() {
    console.log("logout?");
    AuthTokenFactory.setToken();
  };
  return factory;
})

.factory('AuthTokenFactory', function AuthTokenFactory($window) {
  'use strict';
  var store = $window.localStorage;
  var key = 'auth-token';

  return {
    getToken: getToken,
    setToken: setToken
  };

  function getToken() {
    return store.getItem(key);
  }

  function setToken(token) {
    if (token) {
      store.setItem(key, token);
    } else {
      store.removeItem(key);
    }
  }

})

.factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory) {
  'use strict';
  return {
    request: addToken
  };

  function addToken(config) {
    var token = AuthTokenFactory.getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  }
})
;
