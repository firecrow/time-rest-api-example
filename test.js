const runner = require('./test_runner');
console.log(runner);
const {TestArg, TestCase, RunCaseSet} = runner;

const basicSet = [
    new TestCase(
        new TestArg("GET", "/time", {time: null}), "NOW"),
    new TestCase(
        new TestArg("GET", "/time/timezone", {time: null, timezone: null}), "NOW,error"),
    new TestCase(
        new TestArg("GET", "/time/timezone/CDT", {time: null, timezone: 'CDT'}), "NOW,TZ"),
    new TestCase(
        new TestArg("GET", "/time/timezone/EST", {time: null, timezone: 'EST'}), "NOW,TZ"),
    new TestCase(
        new TestArg("GET", "/time/timezone/BST", {time: null, timezone: 'BST'}), "NOW,TZ"),
];

const errorSet = [
    new TestCase(
        new TestArg("GET", "", {}), "error"),
    new TestCase(
        new TestArg("GET", "not-a-thing", {}), "error"),
    new TestCase(
        new TestArg("POST", "/time", {time: null}),  "error"),
    new TestCase(
        new TestArg("OPTIONS", "/time/timezone/EST", {time: null, timezone: 'EST'}), "error"),
];

RunCaseSet(basicSet);
RunCaseSet(errorSet);
