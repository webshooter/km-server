
function route(req, pathname, response, postData) {

  //console.log(req);
  if (typeof req[pathname] === 'function') {

    req[pathname](response, postData);
  
  } else {
  
    if (pathname != "/favicon.ico") {
  
      console.log("No request handler found for " + pathname);
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not found");
      response.end();
  
    }
  
  }

}

exports.route = route;