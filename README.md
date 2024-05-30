# Time REST API example

This is a small example, that was requested during my current job hunt. The purpose is to show a simple REST API server which can respond to a request for the time, and show an adjusted timezone value if given the appropriate parameters.

# Basic Architecture

The main system is comprised of a series of `electors` and `handlers`. For the list of `handlers` if all `electors` pass then the `handler.handle` function will be run.

exceprt from serve_time.js:

```JavaScript

    const handlers = [
        new Handler([hasTime, hasOffset], timeServe),
        new Handler([hasTime], timeBasicServe),
        new Handler([always], notFoundServe)
    ];

    const errorHandler = new Handler(always, errorServe);
```

This is why the server is instantiated with a list of handlers.

The reason for this architecture is to ensure it can grow over time, having more than one handler for gathering more than one thing, if necessary.

# Methodology
The system is in JavaScript and Node.js with no library use above native node and JavaScript functions. This was done because it comes naturally to me, but mostly because without knowing what architecture or framework is used in an existing project, I wanted to design something that could be ported easily to any system.

This is also why the `handleResponse` object does not recieve the native `Node.js` response object, it gets the `method`, `path` and `parameters` parsed out seperately so that it could move to another language/framework/architecture easily without dependencies on `Node.js`

The JavaScript is very raw, I have [another project](/framework-apalooza) which shows multiple front end frameworks working together that follows a more conventional approach when I'm within those frameworks.

# Code Organization

- run.js - runs the server
- serve_time.js - this has the server classes in it
- test.js - runs the tests (used in the github action)
- test_runner.js - this is a quick test framework I wrote for the purpose of testing this system.
- tzlist.js - list of timezone offsets in minutes and hours
