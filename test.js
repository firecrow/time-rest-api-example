const runner = require('./test_runner');
const {TestArg, TestCase, RunCaseSet} = runner;

const basicSet = [
    new TestCase(
        "Expect time to return current time",
        new TestArg("GET", "/time", {time: null}),
            {code: 700000, response: {"currentTime":"NOW"}}),
    new TestCase(
        "Expect timezone without an arg to return an error",
        new TestArg("GET", "/time/timezone", {time: null, timezone: null}),
            {code: 400, response: {"currentTime":"NOW","error":"Timezone not found in international list, looking for null"}}),
    new TestCase(
        "Expect timezone to return an adjusted time for CDT",
        new TestArg("GET", "/time/timezone/CDT", {time: null, timezone: 'CDT'}), 
            {code: 200, response:{"currentTime":"NOW","ajustedTime":"ADJUSTED","timezone":{"name":"Central Daylight Time (North America)","hours":-5,"abbrev":"CDT"}}}),
    new TestCase(
        "Expect timezone to return an adjusted time for EST",
        new TestArg("GET", "/time/timezone/EST", {time: null, timezone: 'EST'}),
            {code: 200, response:{"currentTime":"NOW","ajustedTime":"ADJUSTED","timezone":{"name":"Eastern Standard Time (North America)","hours":-5,"abbrev":"EST"}}}),
    new TestCase(
        "Expect timezone to return an adjusted time for BST",
        new TestArg("GET", "/time/timezone/BST", {time: null, timezone: 'BST'}),
            {code: 200, response: {"currentTime":"NOW","ajustedTime":"ADJUSTED","timezone":{"name":"British Summer Time (British Standard Time from Mar 1968 to Oct 1971)","hours":1,"abbrev":"BST"}}}),
];

const errorSet = [
    new TestCase(
        "Expect empty url to return an error",
        new TestArg("GET", "", {}),
            {code: 404, response: {"error": "Not Found"}}),
    new TestCase(
        "Expect incorrect url to return an error",
        new TestArg("GET", "not-a-thing", {}),
            {code: 404, response: {"error": "Not Found"}}),
    new TestCase(
        "Expect incorrect method to return an error",
        new TestArg("POST", "/time", {time: null}), 
            {code: 404, response: {"error": "Not Found"}}),
    new TestCase(
        "Expect incorrect method to return an error",
        new TestArg("OPTIONS", "/time/timezone/EST", {time: null, timezone: 'EST'}), 
            {code: 404, response: {"error": "Not Found"}}),
];

RunCaseSet(basicSet);
RunCaseSet(errorSet);
