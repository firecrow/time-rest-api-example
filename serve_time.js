const http = require('http');
const fs = require('fs');

TZ_KEYWORD = 'timezone';
TIME_KEYWORD = 'time';

/* election functions */
function always(method, path, params){
    return true;
}

function hasOffset(method, path, params){
    return params.indexOf(TZ_KEYWORD) != -1;
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
    const now = new Date();
    const obj = {
        currentTime: now.toUTCString(),
    };
    res.end(JSON.stringify(obj));
}

function notFoundServe(res, method, path, params){
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end("route not found");
}

function errorServe(res, method, path, params){
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
    new Handler([hasTime, hasOffset], timeServe),
    new Handler([hasTime], timeBasicServe),
    new Handler([always], notFoundServe)
];

const errorHandler = new Handler(always, errorServe);

/* server instantiation */
http.createServer(function (req, res) {
    let done = false;
    const method = req.method;
    const path = req.url;
    const params = req.url.split('/');
    params.shift();
    console.log('Method '+method+' '+path+' ', params);

    for(let i = 0; i < handlers.length; i++){
      let handle = handlers[i];
      if(handle.elect(method, path, params)){
          handle.handle(res, method, path, params); 
          done = true;
          break;
      }
    }
    
    if(!done){
        errorHandler.handle(res, method, path, params);
    }

}).listen(9000);
