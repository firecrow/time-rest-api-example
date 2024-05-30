const http = require('http');
const fs = require('fs');
const tzlist = require('./tzlist');

TZ_KEYWORD = 'timezone';
TIME_KEYWORD = 'time';

const param_keys = [TZ_KEYWORD];

function parseParams(url){
    console.log('parsing ' + url);
    let params = {};
    if(!url){
        return params;
    }
    const segs = url.split('/');
    if(!segs.length){
        return params;
    }

    let key = null;
    segs.shift();
    for(let i = 0; i < segs.length; i++){
        const s = segs[i];
        if(key){
            params[key] = s;        
            key = null;
            continue;
        }
        if(param_keys.indexOf(s) !== -1){
            key = s;
            params[key] = null;
            continue;
        }else{
            params[s] = null;
            continue;
        }
    }
    return params;
}

/* election functions */
function always(method, path, params){
    return true;
}

function hasOffset(method, path, params){
    return !!params[TZ_KEYWORD];
}

function hasTime(method, path, params){
    return TIME_KEYWORD in params;
}

/* response serve functions */
function timeServe(res, method, path, params){
    const now = new Date();
    const obj = {
        currentTime: now.toISOString(),
    };

    const tzArg = params[TZ_KEYWORD];
    const tz = tzlist.tzabbrev[tzArg];
    if(tz){
        obj.timezoneMeta = tz
    }else{
        obj.error = "Timezone not found in international list, looking for "+tzArg;
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(obj));
}

function timeBasicServe(res, method, path, params){
    const now = new Date();
    const obj = {
        currentTime: now.toISOString(),
    };
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(obj));
}

function notFoundServe(res, method, path, params){
    const obj = {
        error: "Not Found",
    };
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(obj));
}

function errorServe(res, method, path, params){
    const obj = {
        error: "Server Error (Internal)",
    };
    res.writeHead(500, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(obj));
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
    const params = parseParams(path);
    console.log(params);

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
