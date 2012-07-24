var db_helper = require("./db_helper"),
    templater = require("./templater");

function home(response, postData) {

  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("KING-ME");
  response.end();

}

function play(response, postData) {
  var data = JSON.parse(postData);
  db_helper.play(data.playerid, data.opponent, 
    function(results) {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(JSON.stringify(results));
      response.end();
    }
  );

  // console.log("handlers.newGame() called...");
  // response.writeHead(200, {"Content-Type": "text/plain"});
  // response.write("newg() handler!");
  // response.end();
}

function update(response, postData) {
  //
}

function join(response, postData) {
  db_helper.newPlayer(JSON.parse(postData), function(results) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(JSON.stringify(results));
    response.end();
  });
}

function validate (response, postData) {
  var data = JSON.parse(postData);
  db_helper.validateField(data.field, data.value, 
    function(results) {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(JSON.stringify(results));
      response.end();
    }
  );
}

function login (response, postData) {
  var data = JSON.parse(postData);
  db_helper.login(data.name, data.pwd, 
    function(results) {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(JSON.stringify(results));
      response.end();
    }
  );
}

function test(response, postData) {
  
  // tmplOptions = {
  //   title: "Title Page",
  //   meta: templater.cache["meta"],
  //   stylesheet: "",
  //   body: "<body>This is the template test page!</body>"
  // };
  //response.write(templater.loadTemplate("main", tmplOptions));

  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(templater.loadTemplate("test"));
  response.end();
}

function move(response, postData) {
	console.log("handlers.move() called...");
  var data = JSON.parse(postData);
}


exports.home     = home;
exports.play     = play;
exports.move     = move;
exports.update   = update;
exports.login    = login;
exports.join     = join;
exports.validate = validate;
exports.test     = test;



