const runner = require('./test_runner');
console.log(runner);
const {TestArg, TestCase, RunCaseSet} = runner;

const basicSet = [
    new TestCase(
        new TestArg("GET", "/time", {}), "NOW"),
    new TestCase(
        new TestArg("GET", "/time/timezone", {}), "NOW,error"),
    new TestCase(
        new TestArg("GET", "/time/timezone/CDT", {}), "NOW,TZ"),
    new TestCase(
        new TestArg("GET", "/time/timezone/EST", {}), "NOW,TZ"),
    new TestCase(
        new TestArg("GET", "/time/timezone/BST", {}), "NOW,TZ"),
];

const errorSet = [
    new TestCase(
        new TestArg("GET", "", {}), "error"),
    new TestCase(
        new TestArg("GET", "not-a-thing", {}), "error"),
    new TestCase(
        new TestArg("POST", "/time", {}),  "error"),
    new TestCase(
        new TestArg("OPTIONS", "/time/timezone/EST", {}), "error"),
];

RunCaseSet(basicSet);
RunCaseSet(errorSet);
