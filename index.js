var server   = require("./server");
var router   = require("./router");
var handlers = require("./handlers");


// Define request handling routes
var req = {}
req["/"]       = handlers.home;
req["/play"]   = handlers.play;
req["/move"]   = handlers.move;
req["/update"] = handlers.update;
req["/login"]  = handlers.login;
req["/join"]   = handlers.join;
req["/val"]    = handlers.validate;
req["/test"]    = handlers.test;

server.start(router.route, req);