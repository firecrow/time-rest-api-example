const TEST_STARTED = 'started';
const TEST_PASS = 'started';
const TEST_FAIL = 'started';

const serveTime = require('./serve_time');

class TestArg {
    constructor(method, path, params){
        this.method = method;
        this.path = path;
        this.params = params;
    }
}

class TestCase {
    constructor(arg, result){
        this.arg = arg;
        this.result = result;
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
    for(let i = 0; i < set.length; i++){
        const res = new MockRes();
        const arg = set[i].arg;
        const response = serveTime.handleRequest(res, arg.method, arg.path, arg.params);
        console.log('finished test');
        console.log(res.code);
        console.log(res.content);
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
