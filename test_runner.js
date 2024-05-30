const TEST_STARTED = 'started';
const TEST_PASS = 'started';
const TEST_FAIL = 'started';

const serveTime = require('./serve_time');
const tzlist = require('./tzlist');

class TestArg {
    constructor(method, path, params){
        this.method = method;
        this.path = path;
        this.params = params;
    }
    toString(){
        const paramJson = JSON.stringify(this.params);
        return `TestArg<${this.method},${this.path},${paramJson}>`;
    }
}

class TestCase {
    constructor(arg, result){
        this.arg = arg;
        this.result = result;
    }
    toString(){
        return this.arg.toString();
    }
}

class MockRes {
    constructor(){
        this.content = "";
        this.code = 0;
    }
    writeHead(code, props){
        this.code = code;
    }
    end(content){
        this.content = content;
    }
}

function RunCaseSet(set){
    const now = new Date();
    const serve = new serveTime.Serve();
    for(let i = 0; i < set.length; i++){
        const res = new MockRes();
        const arg = set[i].arg;
        const result = set[i].result;
        const response = serve.handleRequest(res, now, arg.method, arg.path, arg.params);

        if(res.code != result.code){
            throw new Error('test failure code mismatch: ' + set[i]);
        }

        let adjusted = null;
        const tzArg = arg.params[serveTime.TZ_KEYWORD];
        if(tzArg){
            const tz = tzlist.tzabbrev[tzArg];
            adjusted = serveTime.adjustTime(now, tz);
        }

        const jsonData = JSON.parse(res.content);
        for(let key in result.response){
            if(/NOW/.test(result.response[key])){
                result.response[key] = result.response[key].replace('NOW', now.toISOString());
            }
            if(adjusted && /ADJUSTED/.test(result.response[key])){
                result.response[key] = result.response[key].replace('ADJUSTED', adjusted.toISOString());
            }
        }

        if(JSON.stringify(result.response) !== JSON.stringify(jsonData)){
            console.log(JSON.stringify(result.response))
            console.log(JSON.stringify(jsonData));
            throw new Error('test failure: ' + set[i]);
        }

        console.log('TEST PASS:' + set[i]);
    }
}

module.exports = {
    TEST_STARTED,
    TEST_FAIL,
    TEST_PASS,
    RunCaseSet,
    TestCase,
    TestArg,
};
