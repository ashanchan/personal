var http = require("http");
var open = require("open");
var node_static = require("node-static");

var host = "localhost";
var port = 8080;
var http_serv = http.createServer(handleHTTP).listen(port, host);
var static_files = new node_static.Server(__dirname);

function handleHTTP(req, res){
	if(req.method === "GET"){
		static_files.serve(req,res);
		req.resume();
	}
	else{
		res.writeHead(403);
		res.end("Get out of here");
	}
}
open("http://localhost:8080/app/index.html");
console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C or CTRL + Break to shutdown");