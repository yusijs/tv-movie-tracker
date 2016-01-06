var request = require("request"),
    config = require("../config.js"),
key = config.key;

function compare(a,b) {
  if (a.vote_average < b.vote_average)
    return -1;
  if (a.vote_average > b.vote_average)
    return 1;
  return 0;
}

exports.today = function(req,res) {
    request({
        method: 'GET',
        url: 'http://api.themoviedb.org/3/tv/airing_today',
        qs: {api_key: key, timezone: "NO"},
        headers: {
            'Accept': 'application/json'
        }}, function (error, response, body) {
            console.log('Status:', response.statusCode);
            console.log('Headers:', JSON.stringify(response.headers));
            var result = JSON.parse(body).results;
            response = [];
            for(i=0;i<result.length;i++) {
                if(result[i].vote_count >= 10)
                    response.push(result[i]);
            }
            response.sort(compare).reverse();
            trimmedResponse = [];
            for(i=0;i<response.length;i++) {
                if(i == 5)
                    break;
                trimmedResponse.push(response[i]);
            }
            res.json(trimmedResponse);
        });
}
