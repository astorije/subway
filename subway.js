var connect = require("connect"),
       http = require("http"),
      bower = require("bower"),
    suspend = require("suspend"),
      async = require("async"),
     resume = suspend.resume;

var init_plugins = require("./lib/plugins").initialize;
var static = require("./lib/static");
var connection = require("./lib/connection");

var cwd = __dirname;

async.waterfall([
  function(callback) {
    console.log("Fetching Subway plugins...");
    init_plugins(callback);
  },
  function(callback) {
    console.log("Installing dependencies...");
    bower.commands.install().on("end", function(results){
      callback(null, results);
    });
  },
  function(results, callback) {
    static(function() {
      callback(null);
    });
  }
], function(err, result) {
  var app = connect().use(connect.static(cwd + "/tmp"));

  var server = http.createServer(app).listen(3000);
  var io = require("socket.io").listen(server);

  connection(io);
});
