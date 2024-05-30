const http = require('http');
const fs = require('fs');

TZ_KEYWORD = 'timezone';
TIME_KEYWORD = 'time';


/* election functions */
function always(method, path, params){
    return true;
}

function hasOffset(method, path, params){
    return params.indexOf(TZ_KEYWORD) != 0;
}

function hasTime(method, path, params){
    return params[0] == TIME_KEYWORD;
}

/* response serve functions */
function timeServe(res, method, path, params){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("time with offset here");
}

function timeBasicServe(res, method, path, params){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("basic time here");
}

function notFoundServe(res, method, path, params){
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end("route not found");
}

function errorHandler(res, method, path, params){
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end("unhandled server error");
}

/* class for making handlers */
class Handler {
    process;
    constructor(electors, process){
        this.electors = electors;
        this.process = process;
    }

    elect(method, path, params){
        for(let i = 0; i < this.electors.length; i++){
            if(!this.electors[i](method, path, params)){
                return false
            }
        }
        return true;
    }

    handle(res, method, path, params){
        return this.process(res, method, path, params);
    }
}

/* handler instantiation */
const handlers = [
    Handler([hasTime, hasOffset], timeServe),
    Handler([hasTime], timeBasicServe),
    Handler([always], notFoundServe)
];

const errorHandler = Handler(always, errorServe);

/* server instantiation */
http.createServer(function (req, res) {
    let done = false;
    const method = req.method;
    const path = req.url;
    const params = req.url.split('/');

    for(let i = 0; i < handlers.length; i++){
      let handle = handlers[i];
      if(handle.elect(req.method, req.url)){
          handle.handle(res, method, path, params); 
          done = true;
      }
    }
    
    if(!done){
        errorHandler.handle(res, method, path, params);
    }

}).listen(9000);
