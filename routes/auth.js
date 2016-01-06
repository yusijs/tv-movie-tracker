var bcrypt = require('bcrypt'),
db = require("monk")("localhost/watchlist"),
jwt = require("jsonwebtoken"),
auth = db.get("newAuth");

var jwtSecret = "<K](2Dk90*vOoc:V7c`TF]FS|<5(X[~?-;kXP9W1XAHWgrQ3-JKxc(xr)zH+du].";

exports.logMeIn = function(req,res) {
  auth.find({"username":req.body.username}, function(e,docs) {
    if(e) throw e;
    if(docs.length != 1) {res.send({message: "User not registered", code:0});}
    else {
      bcrypt.compare(req.body.password, docs[0].password, function(err, result) {
        if(result) {
          var token = jwt.sign({
            username: req.body.username,
            userid: docs[0]._id
          }, jwtSecret);
          res.json({token: token, username:req.body.username});
        }
        else {
          res.send({message: "Bad password", code:1});
        }
      });
    }
  });
};

exports.register = function(req,res) {
  res.send("AW YIS");
};
