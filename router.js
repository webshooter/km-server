var fs    = require("fs");

function route(req, pathname, response, postData) {

  var pathWeb = "/web",
      pathInc = "/inc",
      pathPages = "/pages";

  //console.log(req);
  if (typeof req[pathname] === 'function') {

    req[pathname](response, postData);
  
  } else {
  
    if (pathname != "/favicon.ico") {

      fs.exists("." + pathname, 
        function(exists) {
          if (exists) {
            if (pathname.substring(0, pathWeb.length + pathInc.length) === (pathWeb + pathInc) ||
                pathname.substring(0, pathWeb.length + pathPages.length) === (pathWeb + pathPages)) {
              console.log("Fielding request for asset: " + pathname);
              response.writeHead(200, {"Content-Type": "application/javascript"});
              response.write(fs.readFileSync("." + pathname, "utf8"));
              response.end();
            }
          } else {
            console.log("No request handler found for " + pathname);
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not found");
            response.end();
          }
        }
      );

        // /web
        if (pathname.substring(0, pathWeb.length) === pathWeb) {

          // /web/inc
          if (pathname.substring(0, pathWeb.length + pathInc.length) === (pathWeb + pathInc)) {

            pathname.lastIndexOf("/")
            //fs.readFileSync(file, "utf8");
            fs.exists("")

          }

        } else {
    
          

        }
  
    }
  
  }

}

exports.route = route;