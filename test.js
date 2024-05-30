const runner = require('./test_runner');
const {TestArg, TestCase, RunCaseSet} = runner;

const basicSet = [
    new TestCase(
        new TestArg("GET", "/time", {time: null}),
            {code: 200, response: {"currentTime":"NOW"}}),
    new TestCase(
        new TestArg("GET", "/time/timezone", {time: null, timezone: null}),
            {code: 400, response: {"currentTime":"NOW","error":"Timezone not found in international list, looking for null"}}),
    new TestCase(
        new TestArg("GET", "/time/timezone/CDT", {time: null, timezone: 'CDT'}), 
            {code: 200, response:{"currentTime":"NOW","ajustedTime":"ADJUSTED","timezone":{"name":"Central Daylight Time (North America)","hours":-5,"abbrev":"CDT"}}}),
    new TestCase(
        new TestArg("GET", "/time/timezone/EST", {time: null, timezone: 'EST'}),
            {code: 200, response:{"currentTime":"NOW","ajustedTime":"ADJUSTED","timezone":{"name":"Eastern Standard Time (North America)","hours":-5,"abbrev":"EST"}}}),
    new TestCase(
        new TestArg("GET", "/time/timezone/BST", {time: null, timezone: 'BST'}),
            {code: 200, response: {"currentTime":"NOW","ajustedTime":"ADJUSTED","timezone":{"name":"British Summer Time (British Standard Time from Mar 1968 to Oct 1971)","hours":1,"abbrev":"BST"}}}),
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
