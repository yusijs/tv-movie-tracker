var request = require("request"),
    config = require("../config.js"),
key = config.key;

exports.popularShows = function(req,res) {
    request({
        method: 'GET',
        url: 'http://api.themoviedb.org/3/tv/popular',
        qs: {api_key: key},
        headers: {
            'Accept': 'application/json'
        }}, function (error, response, body) {
            console.log('Status:', response.statusCode);
            console.log('Headers:', JSON.stringify(response.headers));
            res.json(JSON.parse(body));
        });
}

exports.showByName = function(req,res) {
    request({
        method: 'GET',
        url: 'http://api.themoviedb.org/3/search/tv',
        qs: {api_key: key, query: req.params.show},
        headers: {
            'Accept': 'application/json'
        }}, function (error, response, body) {
            console.log('Status:', response.statusCode);
            console.log('Headers:', JSON.stringify(response.headers));
            //console.log('Response:', body);
            res.json(JSON.parse(body).results);
        });
}

exports.showById = function(req,res) {
    request({
        method: 'GET',
        url: 'http://api.themoviedb.org/3/tv/'+req.params.id,
        qs: {api_key: key, append_to_response: 'videos,similar'},
        headers: {
            'Accept': 'application/json'
        }}, function(error,response,body) {
            console.log('Status:', response.statusCode);
            console.log('Headers:', JSON.stringify(response.headers));
            res.json(JSON.parse(body));
        });
}
