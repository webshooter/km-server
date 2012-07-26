var http  = require("http"),
    url   = require("url"),
    db = require("./db"),
    templater = require("./templater");

function start(route, req) {

  var port = 8888;
  
  function onRequest(request, response) {

    var postData = "",
        origin = (request.headers.origin || "*"),
        pathname = url.parse(request.url).pathname;
    
    // Set request encoding
    request.setEncoding("utf8");


    // Handle cross-domain calling
    if (request.method.toUpperCase() === "OPTIONS") {

      response.writeHead(
        "204",
        "No Content",
        {
            "access-control-allow-origin": "*", //origin
            "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
            "access-control-allow-headers": "content-type, accept",
            "access-control-max-age": 100, // Seconds.
            "content-length": 0
        }
      );

      return( response.end() );

    }

    // Show the requested route in the console
    // (hiding the favicon requests)
    if (pathname != "/favicon.ico") {
      console.log("Request for " + pathname + " received.");
    }


    // add listener for the data event
    request.on("data", function(postDataChunk) {
      postData += postDataChunk;
    });

    // add listener for the end event
    request.on("end", function() {
      route(req, pathname, response, postData);
    });
    
  }

  // load templates
  templater.addTemplateToCache("main", "./html/main.tmpl.html", true);
  templater.addTemplateToCache("test", "./html/test.html", true);

  // load snippets
  templater.addSnip("meta_default", "./html/meta.snip.html", true);

  http.createServer(onRequest).listen(port);
  console.log("Server has started on port " + port);
  
}

exports.start = start;


