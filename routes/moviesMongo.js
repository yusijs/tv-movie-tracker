var request = require("request"),
    async = require("async"),
    db = require("monk")("localhost/watchlist"),
    movieColl = db.get("movie"),
    watchColl = db.get("watchlist"),
    config = require("../config.js"),
key = config.key;

exports.insertMovieData = function(req,res) {
    request({
        method: 'GET',
        url: 'http://api.themoviedb.org/3/movie/'+req.params.id,
        qs: {api_key: key, append_to_response: 'videos,similar'},
        headers: {
            'Accept': 'application/json'
        }}, function(error,response,body) {
            var doc = JSON.parse(body),
                statusCode = response.statusCode,
                movieId = doc.id;
            switch(statusCode) {
                case 200:
                    var promise = movieColl.insert(doc);
                    promise.on("error", function(e) {
                        res.json({"Status": "Failed", "headers": e, "statusCode": statusCode, "data":"asdf"});
                    });
                    promise.on("success", function(e, data) {
                        res.json({"Status": "OK", "statusCode":statusCode, "data": doc});
                    });
                    break;
                case 429:
                    res.json({"Status": "Failed", "statusCode": statusCode});
                    break;
                default:
                    res.json({"Status": "Something went fubar, try later", "statusCode": statusCode, "headers": response.headers});
            }
        });
};

exports.insertMovieToWatchlist = function(req,res) {
    var id = parseInt(req.params.id);
    // Codes:
    // 0: Already in moviecoll
    // 1: Not in moviecoll, get from TMDB
    // 2: Invalid id, not found in TMDB
    async.series([
            function(callback) {
                movieColl.find({"id": id}, function(e,docs) {
                    if(e || docs.length === 0) {
                        callback(null);
                    }
                    else {
                        callback("0", docs[0]); // 0 = Already have this, stop executing series
                    }
                });
            },
            function(callback) {
              request({
                  method: 'GET',
                  url: 'http://api.themoviedb.org/3/movie/'+id,
                  qs: {api_key: key, append_to_response: 'videos,similar'},
                  headers: {
                      'Accept': 'application/json'
                  }}, function(error,response,body) {
                      var doc = JSON.parse(body),
                          statusCode = response.statusCode,
                          movieId = doc.id;
                      switch(statusCode) {
                          case 200:
                              var promise = movieColl.insert(doc);
                              promise.on("error", function(e) {
                                  callback(null, {"Status": "Failed", "headers": e, "statusCode": statusCode, "data":"asdf"});
                              });
                              promise.on("success", function(e, data) {
                                  callback(null, {"Status": "OK", "statusCode":statusCode, "data": doc});
                              });
                              break;
                          case 429:
                              res.json({"Status": "Failed", "statusCode": statusCode});
                              break;
                          default:
                              res.json({"Status": "Something went fubar, try later", "statusCode": statusCode, "headers": response.headers});
                      }
                  });
            }
    ],
    function(err, results) {
        if(err) {
            switch(err) {
                case 0:
                    console.log({"statusCode": 0, "Error": true, "Reason": "Already in Mongo Collection"});
                    break;
                default:
                    console.log({"Statuscode": 500, "Error": true, "Reason": "Unknown", "Details": err});
            }
        }
        var returnResult = "";
        if(results.length == 1)
            returnResult = results[0];
        else if (results.length > 1)
            returnResult = results[1];
        var relatedArray = (typeof returnResult.similar === "undefined") ? [] : returnResult.similar.results;
        var related = [];
        for(i=0;i<relatedArray.length;i++) {
            related.push({"id": relatedArray[i].id, "original_title": relatedArray[i].original_title, "overview": relatedArray[i].overview});
            if(i==2) {
                break;
            }
        }
        if(returnResult) {
        var insert = {"userid": 1, "id":returnResult.id, "name":returnResult.original_title, "urlencname":returnResult.original_title.replace(" ", "+").toLowerCase(), "genres":returnResult.genres, "related": related};
        var promise = watchColl.insert(insert);
        promise.error(function(err) {
            res.json({"Status": "Failed", "headers": err, "code": 0});
        });
        promise.success(function(doc) {
            res.json({"Status": "Success", "headers": doc, "code": 1});
        });
        }
        else {
          res.send("Nope!");
        }
        // Now lets shove this shit into our watchlist!
    });
};

exports.watchlistList = function(req,res) {
    var userid = 1;
    async.waterfall([
      function(callback) {
        watchColl.find({"userid": userid}, {"fields": {"_id":0,"id":1}}, function(e,docs) {
          if(e) {throw e;}
          if(!docs) {res.end("No docs");}
        var myWatchlist = {};
        for(i=0;i<docs.length;i++) {
            var id = docs[i].id;
            myWatchlist[id] = 1;
        }
        callback(null, myWatchlist);
        //res.json(myWatchlist);
    });
  }, function(watchlistIds, callback) {
    console.log(watchlistIds);
    var watchlist = [];
      request({
          method: 'GET',
          url: 'http://localhost/api/movie/'+watchlistIds[1],
          headers: {
              'Accept': 'application/json'
          }}, function(error,response,body) {
              console.log('Status:', response.statusCode);
              console.log('Headers:', JSON.stringify(response.headers));
              res.send(body);
              //watchlist.push(JSON.parse(body));
          }); // Need underscore.js here for .each

    callback(null,watchlist);
  }], function(e,result) {
    console.log(result);
    //res.json(result);
  });
};
