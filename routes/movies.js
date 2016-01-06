var request = require("request"),
    config = require("../config.js"),
key = config.key,
bodyparser = require("body-parser"),
async = require("async");

exports.popularMovies = function(req,res) {
  request({
    method: 'GET',
    url: 'http://api.themoviedb.org/3/movie/popular',
    qs: {api_key: key},
    headers: {
      'Accept': 'application/json'
    }}, function (error, response, body) {
      console.log('Status:', response.statusCode);
      console.log('Headers:', JSON.stringify(response.headers));
      res.json(JSON.parse(body));
    });
  };
  exports.movieById = function(req,res) { // Need to add lookup in local db first here
    request({
      method: 'GET',
      url: 'http://api.themoviedb.org/3/movie/'+req.params.id,
      qs: {api_key: key, append_to_response: 'videos,similar'},
      headers: {
        'Accept': 'application/json'
      }}, function(error,response,body) {
        console.log('Status:', response.statusCode);
        console.log('Headers:', JSON.stringify(response.headers));
        res.json(JSON.parse(body));
      });
    };

    exports.upcoming = function(req,res) {
      var page = req.params.page ? req.params.page : 1;
      request({
        method: 'GET',
        url: 'http://api.themoviedb.org/3/movie/upcoming',
        qs: {api_key: key, page: page},
        headers: {
          'Accept': 'application/json'
        }}, function(error,response,body) {
          console.log('Status:', response.statusCode);
          console.log('Headers:', JSON.stringify(response.headers));
          res.json(JSON.parse(body));
        });
      };

      exports.movieByName = function(req,res) {
        request({
          method: 'GET',
          url: 'http://api.themoviedb.org/3/search/movie',
          qs: {api_key: key, query: req.params.show},
          headers: {
            'Accept': 'application/json'
          }}, function (error, response, body) {
            console.log('Status:', response.statusCode);
            console.log('Headers:', JSON.stringify(response.headers));
            //console.log('Response:', body);
            res.json(JSON.parse(body).results);
          });
        };
