var express = require("express"),
    app = module.exports = express(),
    morgan = require("morgan"),
    bodyparser = require("body-parser"),
    jwt = require("jsonwebtoken"),
    expressJwt = require("express-jwt"),
    apicache = require('apicache').options({ debug: true }).middleware;

// Exports
var episodes = require("./routes/episodes.js"),
    movies = require("./routes/movies.js"),
    misc = require("./routes/misc.js"),
    shows = require("./routes/shows.js"),
    watchlist = require("./routes/watchlist.js"),
    auth = require("./routes/auth.js"),
    moviesMongo = require("./routes/moviesMongo.js");

// Logging
app.use(morgan('dev'));

// Config
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(expressJwt({secret: "<K](2Dk90*vOoc:V7c`TF]FS|<5(X[~?-;kXP9W1XAHWgrQ3-JKxc(xr)zH+du]."}).unless({path: ["/login","/favicon.ico",/\/api\/movies?\/.+/]}));

// Authentication
app.post("/login", auth.logMeIn);
app.post("/register", auth.register);

// Serve json API
// TV Shows
app.get("/api/shows/search/:show", apicache('1 hour'), shows.showByName);
app.get("/api/show/:id", apicache('1 hour'), shows.showById);
app.get("/api/shows/popular/", apicache('1 hour'), shows.popularShows);
app.get("/api/shows/today", apicache('1 hour'), misc.today);

// Movies
app.get("/api/movies/search/:show", apicache('1 hour'), movies.movieByName);
app.get("/api/movie/:id", apicache('1 hour'), movies.movieById);
app.get("/api/movies/popular", apicache('1 hour'), movies.popularMovies);
app.get("/api/movies/upcoming/:page?", apicache('1 day'), movies.upcoming);

// Insert stuff
app.put("/api/insert/movie/:id", moviesMongo.insertMovieData);
app.put("/api/watchlist/movies/:id", moviesMongo.insertMovieToWatchlist); // Maybe separate section for watchlist?

// Watchlist
app.get("/api/watchlist/list/:id?", moviesMongo.watchlistList);
app.get("/api/watchlist/movies/", watchlist.watchlistMovies);


app.listen(8000);
