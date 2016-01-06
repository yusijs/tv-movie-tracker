var request = require("request"),
    async = require("async"),
    db = require("monk")("localhost/watchlist"),
    movieColl = db.get("movie"),
    watchColl = db.get("watchlist"),
    jwt = require("jsonwebtoken"),
    config = require("../config.js"),
    key = config.key,
    auth = db.get("newAuth");


    exports.watchlistMovies = function(req,res) {
      var auth = req.headers.authorization.split(" ");
      var token = auth[1];
      var decoded = jwt.decode(token, {complete:true});
      console.log(decoded.payload.userid);
      async.waterfall([
        function(callback) {watchColl.find({"userid": decoded.payload.userid}, {fields: {"_id":0, "id":1}}, function(e,docs) {
          if(e) throw e;
          var ids = [];
          async.each(docs, function(v,k) {
            ids.push(v.id);
          });
          callback(null,ids);
        });
      },
      function(ids, callback) {
        movieColl.find({"id": {$in: ids}}, {}, function(e,docs) {
          callback(null,docs);
        });
      }
    ], function(e,results) {
      res.json(results);
    });
  };
